import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database.module";
import { MongoEmployeesRepository } from "./repositories/mongo-employees.repository";
import { employeesProviders } from "./providers/employee.provider";

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [
      MongoEmployeesRepository,
      ...employeesProviders
    ],
  })
  export class EmployeeModule {}