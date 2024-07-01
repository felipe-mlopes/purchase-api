import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { databaseProviders } from "./database.providers";

import { MongoEmployeesRepository } from "./mongoose/repositories/mongo-employees.repository";
import { MongoOrdersRepository } from "./mongoose/repositories/mongo-orders.repository";

import { EmployeesRepository } from "@/domain/purchase/application/repositories/employees-repository";
import { OrdersRepository } from "@/domain/purchase/application/repositories/orders-repository";

@Module({
    imports: [ConfigModule],
    providers: [
        {
          provide: EmployeesRepository,
          useClass: MongoEmployeesRepository
        },
        {
          provide: OrdersRepository,
          useClass: MongoOrdersRepository

        },
        ...databaseProviders 
    ],
    exports: [
      EmployeesRepository,
      OrdersRepository,
      ...databaseProviders
    ],
})

export class DatabaseModule {}