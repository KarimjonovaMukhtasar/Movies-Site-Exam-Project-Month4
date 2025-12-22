import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription-plan.dto"
import { PrismaService } from "src/prisma/prisma.service";
import { PaymentDto } from "./dto/payment.dto";
import { PaymentStatus, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}
  async createPurchase(paymentDto: PaymentDto, req: Request) {
    try{ const user_id = req["user"].id;
    const plan = await this.prisma.subscription_plans.findUnique({
      where: { id: paymentDto.plan_id, status: "active" }
    });
    if (!plan) {
      throw new NotFoundException(
        `THIS SUBSCRIPTION PLAN IS CURRENTLY UNAVAILABLE!`
      );
    }
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + plan.duration_days);
   const [userSubscription] = await this.prisma.$transaction([
  this.prisma.user_subscriptions.create({
    data: {
      user: { connect: { id: user_id } },
      plan: { connect: { id: plan.id } },
      end_date: endDate,
      status: "active",
      auto_renew: paymentDto.auto_renew
    }
  }),
]);

const [payment] = await this.prisma.$transaction([ 
  this.prisma.payments.create({
  data: {
    user_subscription: { connect: { id: userSubscription.id } },
    amount: plan.price,
    payment_method: paymentDto.payment_method,
    payment_details: {
      card_number: paymentDto.payment_details.card_number,
      expiry: paymentDto.payment_details.expiry,
      card_holder: paymentDto.payment_details.card_holder,
    },
    status: PaymentStatus.completed,
    external_transaction_id: 'txn_123456789',
  }
})]);
   return {
      success: true,
      message: "Obuna muvaffaqiyatli sotib olindi",
      data: {
        subscription: {
          id: userSubscription.id,
          plan: {
            id: plan.id,
            name: plan.name
          },
          start_date: now,
          end_date: endDate,
          status: userSubscription.status,
          auto_renew: userSubscription.auto_renew
        },
        payment: {
          id: payment.id,
          amount: plan.price,
          status: payment.status,
          external_transaction_id: "txn_123456789",
          payment_method: payment.payment_method
        }
      }
    }}catch(err){
      throw err
    }
  }

  async findAll(page?: number, limit?: number, search?: string) {
    page = Number(page) || 1;
    if (page < 0) {
      throw new BadRequestException(`INCORRECT PAGE NUMBER!`);
    }
    limit = Number(limit) || 10;
    if (limit < 0) {
      throw new BadRequestException(`INCORRECT LIMIT NUMBER!`);
    }
    const skip = (page - 1) * limit;
    const where = search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive
          }
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.subscription_plans.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      this.prisma.subscription_plans.count({ where })
    ]);

    return {
      success: true,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data
    };
  }

  async createPlan(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const checkDuplicate = await this.prisma.subscription_plans.findUnique({
        where: { name: createSubscriptionDto.name }
      });
      if (checkDuplicate) {
        throw new ConflictException(
          `THIS SUBSCRIPTION PLAN ALREADY EXISTED IN THE DATABASE!`
        );
      }
      const newPlan = await this.prisma.subscription_plans.create({
        data: { ...createSubscriptionDto }
      });
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW SUBSCRIPTION PLAN!`,
        data: newPlan
      };
    } catch (err) {
      throw err;
    }
  }
}
