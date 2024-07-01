import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/database/database.module";

import { GetEmployeeByIdController } from "./get-employee-by-id.controller";

import { GetEmployeeByIdUseCase } from "@/domain/purchase/application/use-cases/get-employee-by-id";

@Module({
    imports: [DatabaseModule],
    controllers: [
        GetEmployeeByIdController
    ],
    providers: [
        GetEmployeeByIdUseCase
    ]
})

export class HttpModule {}