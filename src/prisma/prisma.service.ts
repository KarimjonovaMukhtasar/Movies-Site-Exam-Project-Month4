import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client"
import  { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    private logger = new Logger()
    constructor(){
        const connectionString = process.env.DATABASE_URL
        const pool = new Pool({
            connectionString
        })
        const adapter = new PrismaPg(pool)

        super({
            adapter,
            log:["error","warn"]
        })
    } 
    async onModuleInit() {
       try {
         await this.$connect()
         this.logger.log("Prisma connected")  
       } catch (error) {
            console.log(error)
            process.exit(1)
       }
    }
}

