import { Command, Ctx, Hears, On, Start, Update, Action } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context } from 'telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';
import { AdminGuard } from '../common/guards/admin.guard';
import { CarService } from './car/car.service';  

@Update()
export class BotUpdate {
  constructor(
    private readonly botService: BotService,
    private readonly carService: CarService  
  ) { }


  @UseGuards(AdminGuard)
  @UseFilters(TelegrafExceptionFilter)
  @Command("admin")
  async onAdminCommand(@Ctx() ctx: Context) {
    await this.botService.mainMenu(ctx, `Xush kelibsiz, ADMIN `);
  }


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

  @Hears(["Asosiy menyu qaytish", "Asosiy menyuga qaytish"])  
  async mainMenu(@Ctx() ctx: Context) {
    await this.botService.mainMenu(ctx)
  }


  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }


  // ========== CAR HANDLERS ==========

  @Hears('Moshinalar')
  async carMenu(@Ctx() ctx: Context) {
    await this.carService.carMenu(ctx);
  }

  @Hears('Mening moshinalarim')
  async showCars(@Ctx() ctx: Context) {
    await this.carService.showCars(ctx);
  }

  @Hears("Yangi moshina qo'shish")
  async addCar(@Ctx() ctx: Context) {
    await this.carService.addNewCar(ctx);
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    await this.carService.onPhoto(ctx);
  }

  @Action(/^car_\d+$/)
  async carDetails(@Ctx() ctx: Context) {
    await this.carService.showCarDetails(ctx);
  }

  @Action(/^delcar_\d+$/)
  async deleteCar(@Ctx() ctx: Context) {
    await this.carService.delCar(ctx);
  }


  // ========== TEXT HANDLER ==========

  @On("text")
  async onText(@Ctx() ctx: Context) {
    return this.botService.onText(ctx)
  }

}


// --------------

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




