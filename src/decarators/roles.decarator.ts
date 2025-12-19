import { Roles } from "./role.enum";
import { SetMetadata } from "@nestjs/common";

export const UserRoles = (...roles: Roles[]) => SetMetadata("roles", roles)