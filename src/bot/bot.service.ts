import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { InjectBot } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.constants';
import { Context, Markup, Telegraf } from 'telegraf';
import { Address } from './models/address.model';
import { Op } from "sequelize";
import { AddressService } from './address/address.service';


@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    private readonly addressService: AddressService
  ) { }

  async start(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await this.botModel.create({
          user_id,
          username: ctx.from!.username,
          first_name: ctx.from!.first_name,
          last_name: ctx.from!.last_name,
          language_code: ctx.from!.language_code,
        });
        await ctx.replyWithHTML(`Iltimos, <b>📞 Telefon raqamni yuborish</b> tugmasini bosing`, {
          ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)],
          ])
            .oneTime()
            .resize(),
        })
      } else if (!user.is_active) {
        await ctx.replyWithHTML(`Iltimos, <b>📞 Telefon raqamni yuborish</b> tugmasini bosing`,
          {
            ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)],
            ])
              .oneTime()
              .resize(),
          })
      } else {
        await this.mainMenu(ctx, `Bu bot orqali skidkachi tizimida faoliyat olib borayotgan Magazin egalari uchun`,);

        // await ctx.replyWithHTML(`Bu bot orqali skidkachi tizimida faoliyat olib borayotgan Magazin egalari uchun`,
        //   {
        //     ...Markup.keyboard([["Sozlamalar", "Manzillar"]])
        //   }) 
      }
    } catch (error) {
      console.log('Error on start', error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ('contact' in ctx.message!) {
        const user_id = ctx.from!.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)]])
              .oneTime()
              .resize(),
          });
        } else if (ctx.message!.contact.user_id != user_id) {
          await ctx.replyWithHTML("O'zingizni yuboring ", {
            ...Markup.keyboard([[Markup.button.contactRequest(`📞 Telefon raqamni yuborish`)]])
              .oneTime()
              .resize(),
          });
        } else {
          const phone = ctx.message.contact.phone_number
          user.is_active = true
          user.phone_number = phone[0] == "+" ? phone : "+" + phone;
          await user.save();
          await this.mainMenu(ctx, "Tabriklayman siz Owner sifatida faollashtirildingiz ");
          // await ctx.replyWithHTML("Tabriklayman siz Owner sifatida faollashtirildingiz ",
          //   {
          //     ...Markup.keyboard([["Sozlamalar","Manzillar"]])
          //   }
          // );
        }
      }
    } catch (error) {
      console.log('Error on Contact', error);
    }
  }


  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from!.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([['./tart']]).resize(),
          });
        } else {
          //  ---------------------------------- ADDRESS ----------------------
          const address = await this.addressModel.findOne({
            where: { user_id, last_state: { [Op.ne]: 'finish' } },
            order: [["id", "DESC"]],

          });
          if (address) {
            switch (address.last_state) {
              case "name":
                address.name = ctx.message.text;
                address.last_state = "address";
                await address.save()
                await ctx.replyWithHTML("Manzilni kiriting (masalan, Muqumiy 15):", {});
                break;

              case "address":
                address.address = ctx.message.text;
                address.last_state = "location";
                await address.save()
                await ctx.replyWithHTML("Manzilni lokatsiyasini yuboring:", {
                  ...Markup.keyboard([
                    [Markup.button.locationRequest("Lokatsiyani yuboring")],
                  ]),
                });
                break;

              default:
                break
            }
          }


          //  ---------------------------------- CAR ----------------------
          //  ---------------------------------- SHOP ----------------------
        }
      } else {

      }
    } catch (error) {
      console.log('Error on onText', error);
    }
  }



  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from!.id;
        const user = await this.botModel.findByPk(user_id); 
        if (!user) {
          await ctx.replyWithHTML("/start", {
            ...Markup.keyboard([['./tart']]).resize(), 
          });
        } else {
          //  ---------------------------------- ADDRESS ----------------------

          const address = await this.addressModel.findOne({
            where: { user_id, last_state: "location" },
            order: [["id", "DESC"]],

          });
          if (address) {
            address.location = `${ctx.message.location.latitude}, ${ctx.message.location.longitude}`;
            
            address.last_state = "finish";
            await address.save();
            await this.addressService.addressMenu(ctx, "Yangi manzil qo'shildi")
            
          }


          //  ---------------------------------- CAR ----------------------
          //  ---------------------------------- SHOP ----------------------
        }
      } else {

      }
    } catch (error) {
      console.log('Error on onText', error);
    }
  }


  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);
      await this.bot.telegram.sendChatAction(user_id, "record_voice");
      await this.bot.telegram.sendMessage(user_id, "Salom");

      if (user) {
        user.is_active = false;
        await user.save();
        await ctx.replyWithHTML("Siz botda faoliyatni to'xtatdingiz. Qayt ishga tushirish uchu <b> start</b> bosing ", {
          ...Markup.keyboard([[(`/start`)]])
            .oneTime()
            .resize(),
        })
      }
    } catch (error) {
      console.log('Error on stop', error);
    }
  }

  async sendOtp(phone_number: string, OTP: string) {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });
      console.log(user)
      if (!user || !user.is_active) {
        return false;
      }

      await this.bot.telegram.sendMessage(user.user_id, 'Verify code:' + OTP);
      return true;
    } catch (error) {
      console.log('Error on send OTP', error);

    }
  }



  async mainMenu(ctx: Context, menuText = "Asosiy menusi") {
    try {

      await ctx.replyWithHTML(menuText,
        {
          ...Markup.keyboard([["Sozlamalar", "Manzillar"]]).resize(),
        }
      );


    } catch (error) {
      console.log('Error on mainMenu', error);
    }
  }





}
