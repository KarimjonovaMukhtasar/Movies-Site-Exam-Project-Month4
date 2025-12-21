import { PartialType } from "@nestjs/swagger";
import { CreateSubscriptionDto } from "./create-subscription-plan.dto";

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}
