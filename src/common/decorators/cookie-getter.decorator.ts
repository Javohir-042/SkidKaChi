import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";


// Custom Param Decorator yaratish
export const CookieGetter = createParamDecorator(
    async (key: string, context: ExecutionContext): Promise<string> => {            // key: string — cookie nomi // context: ExecutionContext — hozirgi request konteksti

        const request = context.switchToHttp().getRequest();                        // Request obyektini olish

        const refreshToken = request.cookies[key];                                  // Request.cookies ichidan kerakli cookie nomi bo‘yicha olish

        if (!refreshToken) {                                                        // Agar cookie topilmasa, xatolik chiqarish
            throw new BadRequestException("Token is not found");
        }
        return refreshToken;
    }
);