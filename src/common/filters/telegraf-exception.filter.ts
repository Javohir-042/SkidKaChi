
// Xatolikni ushlab olib telegram ga catolikni yuboradi 

import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TelegrafArgumentsHost } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
    async catch(exception: Error, host: ArgumentsHost): Promise<void> {
        const telegrafHost = TelegrafArgumentsHost.create(host);
        const ctx = telegrafHost.getContext<Context>();
        await ctx.replyWithHTML(`<b>Permission</b>: ${exception.message}`, {
            ...Markup.removeKeyboard(),
        });
    }
}






// =====================================

// Bu class — Telegraf botda chiqadigan xatoliklarni ushlab, foydalanuvchiga chiroyli xabar yuborish uchun ishlatiladi.

// NestJS’dagi @Catch() dekoratori bilan ExceptionFilter yasaymiz — u try/catch kabi, lekin barcha joyda avtomatik ishlaydi.