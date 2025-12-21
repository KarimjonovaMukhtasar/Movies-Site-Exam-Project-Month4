import { Injectable } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription-plan.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription-plan.dto";

@Injectable()
export class SubscriptionService {
  create(createSubscriptionDto: CreateSubscriptionDto) {
    return {
      success: true,
      message: "Obuna muvaffaqiyatli sotib olindi",
      data: {
        subscription: {
          id: "550e8400-e29b-41d4-a716-446655440010",
          plan: {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Premium"
          },
          start_date: "2025-05-12T16:10:22Z",
          end_date: "2025-06-11T16:10:22Z",
          status: "active",
          auto_renew: true
        },
        payment: {
          id: "550e8400-e29b-41d4-a716-446655440011",
          amount: 49.99,
          status: "completed",
          external_transaction_id: "txn_123456789",
          payment_method: "card"
        }
      }
    };
  }

  findAll() {
    return {
      success: true,
      data: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Free",
          price: 0.0,
          duration_days: 0,
          features: ["SD sifatli kinolar", "Reklama bilan"]
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Premium",
          price: 49.99,
          duration_days: 30,
          features: ["HD sifatli kinolar", "Reklamasiz", "Yangi kinolar"]
        }
      ]
    };
  }
}
