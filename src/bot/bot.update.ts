import { Action, Command, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context, Markup } from 'telegraf';
import { text } from 'stream/consumers';
import { keyboard } from 'telegraf/markup';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) { }

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);
  }

  @Command("stop")
  async onStop(@Ctx() ctx: Context) {
    await this.botService.onStop(ctx)
  }

  @Hears("Asosiy menyu qaytish")                         // yoniga Rus tilida yozib qoysa ham boladi (,) orqali 
  async mainMenu(@Ctx() ctx: Context) {
    await this.botService.mainMenu(ctx)
  }



  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }


  @On("text")
  async onText(@Ctx() ctx: Context) {
    return this.botService.onText(ctx)
  }

  //   @On("message")
  //   async onMessage(@Ctx() ctx: Context) {
  //     console.log(ctx.botInfo);
  //     console.log(ctx.chat);
  //     console.log(ctx.chat?.type);
  //     console.log(ctx.from);
  //     console.log(ctx.from?.username);

  //   }



















  //   @On("photo")
  //   async onPhoto(@Ctx() ctx: Context) {
  //     if ("photo" in ctx.message!) {
  //       console.log(ctx.message.photo);
  //       await ctx.replyWithPhoto(
  //         ctx.message.photo[ctx.message.photo.length - 1].file_id   // eng yahshi kachistvada chiqarish rasimni
  //       )
  //     }
  //   }


  //   @On("video")
  //   async onVideo(@Ctx() ctx: Context) {
  //     if ("video" in ctx.message!) {
  //       console.log(ctx.message.video);
  //       await ctx.reply(ctx.message.video.file_name!)
  //       await ctx.reply(String(ctx.message.video.duration!));
  //     }
  //   }


  //   @On("sticker")
  //   async onSticker(@Ctx() ctx: Context) {
  //     if ("sticker" in ctx.message!) {
  //       console.log(ctx.message.sticker)
  //       await ctx.reply("😂");
  //     }
  //   }


  //   @On("animation")
  //   async onAnimation(@Ctx() ctx: Context) {
  //     if ("animation" in ctx.message!) {
  //       console.log(ctx.message.animation)
  //       await ctx.reply(ctx.message.animation.mime_type!);
  //     }
  //   }


  //   @On("voice")
  //   async onVoice(@Ctx() ctx: Context) {
  //     if ("voice" in ctx.message!) {
  //       console.log(ctx.message.voice)
  //       await ctx.replyWithVoice(ctx.message.voice.file_id);
  //     }
  //   }


  //   @On("contact")
  //   async onContact(@Ctx() ctx: Context) {
  //     if ("contact" in ctx.message!) {
  //       console.log(ctx.message.contact)
  //       await ctx.reply(ctx.message.contact.phone_number);
  //       await ctx.reply(String(ctx.message.contact.user_id));
  //       await ctx.reply(String(ctx.message.contact.first_name));
  //     }
  //   }




  //   @Hears("hi")
  //   async hearsHi(@Ctx() ctx: Context) {
  //     await ctx.replyWithHTML("<b>Hay there</b>")
  //   }


  //   @Command("help")
  //   async helpCommand(@Ctx() ctx: Context) {
  //     await ctx.replyWithHTML("<b>Ertaga yordam beraman</b>")
  //   }

  //   @Hears("Olti")
  //   async hearsOlti(@Ctx() ctx: Context) {
  //     await ctx.replyWithHTML("<b>Olti bosildi</b>")
  //   }

  //   @Action("product_1")
  //   async prod1(@Ctx() ctx: Context) {
  //     await ctx.replyWithHTML("<b>1 bosildi</b>")
  //   }


  //   @Action(/^product_\d+/)     // ^ so'zning boshlanishi   // \d\d  nechda d bolsa shuncha honali raqam ligini bildiradi bu hozir 2 honali sonlar 1 dan 99 gacha
  //   async selectAnyProductSelect(@Ctx() ctx: Context) {
  //     if ("data" in ctx.callbackQuery!) {
  //       const data = ctx.callbackQuery?.data
  //       const productId = data.split('_')[1]

  //       await ctx.replyWithHTML(`<b>${productId} bosildi</b>`);
  //     }

  //   }


  //   @Command("main")
  //   async mainKeyboard(@Ctx() ctx: Context) {
  //     await ctx.reply("<b>Main buttonni tanlang</b>", {
  //       parse_mode: "HTML",
  //       ...Markup.keyboard([
  //         ["Bir", "Ikki", "Uch"],
  //         ["To'rt", "Besh"],
  //         ["Olti"],
  //         [
  //           Markup.button.contactRequest('📞 Telefon raqamingni yubor')
  //         ],
  //         [
  //           Markup.button.locationRequest('📍 Turgan manzilingni yubor ')
  //         ],
  //       ]).resize()
  //         .oneTime(),
  //     });
  //   }

  //   @Command("inline")
  //   async inlineKeyboard(@Ctx() ctx: Context) {
  //     const keyboards = [
  //       [
  //         {
  //           text: "Product 1",
  //           callback_data: "product_1"
  //         },
  //         {
  //           text: "Product 2",
  //           callback_data: "product_2"
  //         },
  //         {
  //           text: "Product 3",
  //           callback_data: "product_3"
  //         }
  //       ],
  //       [
  //         {
  //           text: "Product 4",
  //           callback_data: "product_4"
  //         },
  //         {
  //           text: "Product 5",
  //           callback_data: "product_5"
  //         },
  //       ],
  //       [
  //         {
  //           text: "Product 6",
  //           callback_data: "product_6"
  //         },
  //       ]
  //     ]
  //     await ctx.reply("<b>Productni tanlang</b>", {
  //       parse_mode: "HTML",
  //       reply_markup: {
  //         inline_keyboard: keyboards
  //       },
  //     });
  //   }

}
