import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest()
        const authHeader = req.headers.authorization

        if (!authHeader) {
            throw new UnauthorizedException("AuthHeader topilmadi")
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new UnauthorizedException("Token topilmadi")
        }

        let decodedToken: any;
        try {
            decodedToken = this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_KEY,
            });
        } catch (error) {
            throw new UnauthorizedException({
                message: "Foydalanuvchi avorizatsiyadan o'tmagan",
                error,
            });
        }
        req.user = decodedToken
        return true
    }
}