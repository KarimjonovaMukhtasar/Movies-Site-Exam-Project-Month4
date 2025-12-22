import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription-plan.service";
import { SubscriptionPlanController } from "./subscription-plan.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule],
  controllers: [SubscriptionPlanController],
  providers: [SubscriptionService]
})
export class SubscriptionModule {}
