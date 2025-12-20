import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const ctx = context.switchToHttp()
        const req = ctx.getRequest()
        const roles = this.reflector.get("roles", context.getHandler())
        if(!roles.includes(req.user.role)){
            throw new ForbiddenException()
        }
        return true
    }
}
