import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request as ExpressRequest } from 'express';


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<ExpressRequest>();
        const token = req.cookies?.refresh_token
        if(!token){
            throw new UnauthorizedException(`YOU HAVE NOT BEEN AUTHORIZED YET!`)
        }
        try {
            const payload = await this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET})
            req.user = payload
            return true
        } catch (error) {
            throw new UnauthorizedException(`INVALID OR EXPIRED TOKEN!`)
        }
    }
}
