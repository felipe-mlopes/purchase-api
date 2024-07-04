import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database.module";
import { MongoOrdersRepository } from "./repositories/mongo-orders.repository";
import { ordersProviders } from "./providers/order.provider";

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [
      MongoOrdersRepository,
      ...ordersProviders
    ],
  })
  export class OrderModule {}