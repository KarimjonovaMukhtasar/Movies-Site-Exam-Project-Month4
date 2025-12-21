import { Module } from "@nestjs/common";
import { SubscriptionService } from "./subscription-plan.service";
import { SubscriptionPlanController } from "./subscription-plan.controller";

@Module({
  controllers: [SubscriptionPlanController],
  providers: [SubscriptionService]
})
export class SubscriptionModule {}
