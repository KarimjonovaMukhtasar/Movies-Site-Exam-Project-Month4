// import { Injectable, OnModuleInit } from "@nestjs/common";
// import {Redis} from "ioredis"


// @Injectable()
// export class RedisService implements OnModuleInit{
//     private client = new Redis()
//     onModuleInit() {
//         this.client = new Redis({
//             host: "localhost"
//         })
//     }

//     async set(key: string, code: number, second: number){
//         return await this.client.set(key, code, "EX", second)
//     }

//     async get(key: string){
//         return await this.client.get(key)
//     }

//     async del(key: string){
//         return await this.client.del(key)
//     }
// }
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
     const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error("REDIS_URL is not defined in environment variables!");
    }
    this.client = new Redis(redisUrl);
    this.client.on("connect", () => console.log("✅ Redis connected"));
    this.client.on("error", (err) => console.error("❌ Redis error", err));
  }

  async set(key: string, value: string | number, seconds: number) {
    return this.client.set(key, value.toString(), "EX", seconds);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}
