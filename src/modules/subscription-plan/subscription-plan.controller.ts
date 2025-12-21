import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from "@nestjs/common";
import { SubscriptionService } from "./subscription-plan.service";
import { CreateSubscriptionDto } from "./dto/create-subscription-plan.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription-plan.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { RoleGuard } from "src/guards/role.guard";

@Controller("subscription")
export class SubscriptionPlanController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "{ USER, ADMIN, SUPERADMIN}" })
  @ApiSecurity('cookie-auth-key')
  @Get("plans")
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Post("purchase")
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id);
  }
}
