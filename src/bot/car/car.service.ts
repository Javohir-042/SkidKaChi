import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from '../models/car.model';
import { Context, Markup, Telegraf } from 'telegraf';
import { Op } from 'sequelize';
import { InjectBot } from 'nestjs-telegraf';
import { BOT_NAME } from '../../app.constants';

@Injectable()
export class CarService {
    private readonly logger = new Logger(CarService.name);

    constructor(
        @InjectModel(Car) private readonly carModel: typeof Car,
        @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    ) { }

    async carMenu(ctx: Context, text = "🚗 Moshinalar bo'limi") {
        await ctx.replyWithHTML(text, {
            ...Markup.keyboard([
                ['Mening moshinalarim'],
                ["Yangi moshina qo'shish"],
                ['Asosiy menyuga qaytish'],
            ]).resize(),
        });
    }

    async showCars(ctx: Context) {
        const user_id = ctx.from!.id;
        const cars = await this.carModel.findAll({ where: { user_id } });

        if (!cars.length) {
            await ctx.reply("Sizda hali moshina yo'q 🚘");
            return;
        }

        const keyboards = cars.map(car => [
            { text: `${car.brand ?? ''} ${car.model ?? ''} (${car.car_number ?? ''})`, callback_data: `car_${car.id}` },
            { text: "🗑 O'chirish", callback_data: `delcar_${car.id}` }
        ]);

        await ctx.reply('<b>Sizning moshinalaringiz:</b>', {
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: keyboards },
        });
    }

    async addNewCar(ctx: Context) {
        const user_id = ctx.from!.id;
        const unfinished = await this.carModel.findOne({
            where: { user_id, last_state: { [Op.ne]: 'finish' } },
        });

        if (unfinished) {
            await ctx.reply('❗ Oldingi moshinani tugatmagansiz, iltimos, davom eting.');
            return;
        }

        await this.carModel.create({ user_id, last_state: 'car_number' });
        await ctx.replyWithHTML('Moshina raqamini kiriting (masalan: <b>01A123AB</b>):');
    }

    async onText(ctx: Context) {
        const user_id = ctx.from!.id;
        const car = await this.carModel.findOne({
            where: { user_id, last_state: { [Op.ne]: 'finish' } },
            order: [['id', 'DESC']],
        });
        if (!car) return;

        const text = (ctx.message as any)?.text;
        if (!text) return;

        switch (car.last_state) {
            case 'car_number':
                car.car_number = text.toUpperCase();
                car.last_state = 'color';
                await car.save();
                await ctx.reply('Moshina rangini kiriting:');
                break;

            case 'color':
                car.color = text;
                car.last_state = 'model';
                await car.save();
                await ctx.reply('Moshina modelini kiriting:');
                break;

            case 'model':
                car.model = text;
                car.last_state = 'brand';
                await car.save();
                await ctx.reply('Moshina markasini kiriting:');
                break;

            case 'brand':
                car.brand = text;
                car.last_state = 'photo';
                await car.save();
                await ctx.reply("Rasm yuboring yoki 'skip' deb yozing:");
                break;

            case 'photo':
                if (text.toLowerCase() === 'skip') {
                    car.last_state = 'finish';
                    await car.save();
                    await this.carMenu(ctx, "✅ Moshina muvaffaqiyatli qo'shildi!");
                } else {
                    await ctx.reply("❌ Rasm yuboring yoki 'skip' deb yozing");
                }
                break;
        }
    }

    async onPhoto(ctx: Context) {
        const user_id = ctx.from!.id;
        const car = await this.carModel.findOne({
            where: { user_id, last_state: 'photo' },
            order: [['id', 'DESC']],
        });
        if (!car) return;

        const photo = (ctx.message as any)?.photo?.at(-1);
        if (!photo?.file_id) {
            await ctx.reply("❌ Rasm topilmadi. Qayta yuboring yoki 'skip' deb yozing");
            return;
        }

        car.image_url = photo.file_id;
        car.last_state = 'finish';
        await car.save();

        await ctx.reply(`✅ Moshina qo'shildi!`);
        await this.carMenu(ctx);
    }

    async showCarDetails(ctx: Context) {
        await ctx.answerCbQuery();
        const data = (ctx.callbackQuery as any).data;
        const carId = Number(data.split('_')[1]);
        const car = await this.carModel.findByPk(carId);
        if (!car) return;

        let caption = `🚘 <b>${car.brand} ${car.model}</b>\n🔢 Raqam: ${car.car_number}\n🎨 Rang: ${car.color}`;
        if (car.image_url) {
            await ctx.replyWithPhoto(car.image_url, { caption, parse_mode: 'HTML' });
        } else {
            await ctx.replyWithHTML(caption);
        }
    }

    async delCar(ctx: Context) {
        await ctx.answerCbQuery();
        const data = (ctx.callbackQuery as any).data;
        const carId = Number(data.split('_')[1]);
        await this.carModel.destroy({ where: { id: carId } });
        await ctx.reply('🗑 Moshina o‘chirildi!');
        await this.showCars(ctx);
    }
}
