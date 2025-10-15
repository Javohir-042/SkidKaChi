import { Action, Command, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { AddressService } from './address.service';
import { Context, Markup } from 'telegraf';
import { text } from 'stream/consumers';
import { keyboard } from 'telegraf/markup';

@Update()
export class AddressUpdate {
  constructor(private readonly addressService: AddressService) { }

  @Hears("Manzillar")                         // yoniga Rus tilida yozib qoysa ham boladi (,) orqali 
  async hearsAddress(@Ctx() ctx: Context) {
    await this.addressService.addressMenu(ctx)
  }

  @Hears("Mening manzillarim")
  async showAddresses(@Ctx() ctx: Context) {
    await this.addressService.showAddresses(ctx)
  }


  @Hears("Yangi manzil qo'shish")                         
  async addNewAddress(@Ctx() ctx: Context) {
    await this.addressService.addNewAddress(ctx)
  }


  @Action(/^loc_+\d+$/)
  async showLocation(@Ctx() ctx: Context) {
    await this.addressService.showLocation(ctx)
  }


  @Action(/^del_+\d+$/)
  async delLocation(@Ctx() ctx: Context) {
    await this.addressService.delLocation(ctx)
  }
}
