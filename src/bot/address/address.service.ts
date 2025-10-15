import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { Bot } from '../models/bot.model';
import { BOT_NAME } from '../../app.constants';
import { Address } from '../models/address.model';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) { }


  async addressMenu(ctx: Context, menuText = "Manzillar menusi") {
    try {

      await ctx.replyWithHTML(menuText,
        {
          ...Markup.keyboard([
            ["Mening manzillarim", "Yangi manzil qo'shish"],
            ["Asosiy menyu qaytish"],
          ]).resize(),
        }
      );


    } catch (error) {
      console.log('Error on AddressMenu', error);
    }
  }



  async addNewAddress(ctx: Context) {
    try {

      const user_id = ctx.from?.id
      const user = await this.botModel.findByPk(user_id)
      if (!user) {
        await ctx.replyWithHTML("/start",
          {
            ...Markup.keyboard([["/start"]]).resize(),
          }
        );
      }

      await this.addressModel.create({ user_id, last_state: "name" });

      await ctx.replyWithHTML("Yangi manzil nomini kiriting:", {
        ...Markup.removeKeyboard(),
      });


    } catch (error) {
      console.log('Error on AddressMenu', error);
    }
  }


  async showLocation(ctx: Context) {
    try {

      const contextAction = ctx.callbackQuery!["data"];
      const contextMessage = ctx.callbackQuery!["message"];
      const address_id = contextAction.split("_")[1];
      const address = await this.addressModel.findOne({ where: { id: address_id } });

      await ctx.deleteMessage(contextMessage?.message_id);        
      await ctx.replyWithLocation(
        Number(address?.location.split(',')[0]),
        Number(address?.location.split(',')[1]),
      );

      // await ctx.deleteMessage(contextMessage?.message_id);  

    } catch (error) {
      console.log('Error on showLocation', error);   
    } 
  }


  async delLocation(ctx: Context) {
    try {

      const contextAction = ctx.callbackQuery!["data"];
      const address_id = contextAction.split("_")[1];
      await this.addressModel.destroy({ where: { id: address_id } });

      await ctx.editMessageText("Manzil o'chirildi");  

    } catch (error) {
      console.log('Error on delLocation', error);
    }
  }




  async showAddresses(ctx: Context) {
    try {

      const user_id = ctx.from?.id
      const user = await this.botModel.findByPk(user_id)
      if (!user) {
        await ctx.replyWithHTML("/start",
          {
            ...Markup.keyboard([["/start"]]).resize(),
          }
        );
      }

      const addresses = await this.addressModel.findAll({
        where: { user_id, last_state: "finish" },
      });

      if (addresses.length == 0) {
        await ctx.replyWithHTML("Sizda manzil qo'shilmagan");
      } else {
        addresses.forEach(async (addresses) => {
          await ctx.replyWithHTML(
            `<b>Manzil nomi: </b> ${addresses.name}\n<b>Manzil: </b> ${addresses.address}\n`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Lokatsiyani ko'rish",
                      callback_data: `loc_${addresses.id}`,
                    },
                    {
                      text: "Manzilni o'chirish",
                      callback_data: `del_${addresses.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }


    } catch (error) {
      console.log('Error on showAddresses', error);
    }
  }


}
