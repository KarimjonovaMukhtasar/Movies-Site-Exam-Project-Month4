import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req
} from "@nestjs/common";
import { SubscriptionService } from "./subscription-plan.service";
import { CreateSubscriptionDto } from "./dto/create-subscription-plan.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription-plan.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { ApiOperation, ApiQuery, ApiSecurity } from "@nestjs/swagger";
import { RoleGuard } from "src/guards/role.guard";
import { UserRoles } from "src/decarators/roles.decarator";
import { Roles } from "src/decarators/role.enum";
import { PaymentDto } from "./dto/payment.dto";

@Controller("subscription")
export class SubscriptionPlanController {
  constructor(private readonly subscriptionService: SubscriptionService) {}


  @ApiSecurity('cookie-auth-key')
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(Roles.admin, Roles.superadmin)
  @ApiOperation({ summary: "{ ADMIN, SUPERADMIN}" })
   @Post("create-plan")
  createPlan(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createPlan(createSubscriptionDto);
  }

  @ApiSecurity('cookie-auth-key')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @Get("plans")
  findAll(@Query("page") page?: number,
  @Query("limit") limit?: number,
  @Query("search") search?: string,) {
    return this.subscriptionService.findAll(page,
    limit,
    search);
  }

  @ApiSecurity('cookie-auth-key')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @Post("purchase")
  createPurchase(@Body() paymentDto: PaymentDto, @Req() req: Request) {
    return this.subscriptionService.createPurchase(paymentDto, req);
  }

}
