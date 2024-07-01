import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { EmployeesRepository } from "@/domain/purchase/application/repositories/employees-repository";
import { Employee } from "@/domain/purchase/enterprise/entities/employee";

@Injectable()
export class MongoEmployeesRepository implements EmployeesRepository {
    constructor(
        @Inject('EMPLOYEE_MODEL')
    private employeeModel: Model<Employee>,
    ) {}

    async findById(id: string): Promise<Employee | null> {
        throw new Error("Method not implemented.");
    
    }

    async findAll(): Promise<Employee[]> {
        throw new Error("Method not implemented.");
    }

    async findByEmail(email: string): Promise<Employee | null> {
        throw new Error("Method not implemented.");
    }

    async findByRole(email: string): Promise<Employee[]> {
        throw new Error("Method not implemented.");
    }

    async save(employee: Employee): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async create(employee: Employee): Promise<void> {
        throw new Error("Method not implemented.");
    }    
}