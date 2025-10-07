import { SetMetadata } from "@nestjs/common";               // NestJS dan SetMetadata dekoratorini import qilamiz
import { Role } from "../enum/user.enum";                   // Foydalanuvchi rollarini aniqlovchi enum import qilinadi


export const ROLES_KEY = 'roles';                           // ROLES_KEY constant yaratamiz — bu metadata kalit nomi bo‘ladi

export const Roles = (...roles: (Role | string)[]) => SetMetadata(ROLES_KEY, roles)     // Roles dekoratori — bu controller yoki route handler’ga metadata sifatida rollarni o‘rnatadi




// ===========================================================
// SetMetadata:

// NestJS funksiyasi bo‘lib, route yoki controller metodiga maxsus metadata(qo‘shimcha ma’lumot) qo‘shadi.

// Bu ma’lumot keyinchalik Guardlar yoki boshqa protsesslarda ishlatiladi.