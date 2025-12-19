import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp()
        const req = ctx.getRequest()
        const res = ctx.getResponse()
        const next = ctx.getNext()
        if(!req.headers.authorization){
             throw new UnauthorizedException()
        }
        const token = req.headers.authorization.split(' ')[1] 
        const type = req.headers.authorization.split(' ')[0]
        if(type !== "Bearer" || token === undefined){
            throw new UnauthorizedException()
        }
        try {
            const checkToken = await this.jwtService.verify(token, {secret: process.env.ACCESS_SECRET})
            req.user = checkToken
               return true
        } catch (error) {
             throw new UnauthorizedException()
        }
    }
}
