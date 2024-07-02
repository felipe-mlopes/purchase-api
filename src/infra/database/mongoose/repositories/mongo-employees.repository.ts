import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { EmployeeParams, EmployeesRepository } from "@/domain/purchase/application/repositories/employees-repository";
import { Employee } from "@/domain/purchase/enterprise/entities/employee";

@Injectable()
export class MongoEmployeesRepository implements EmployeesRepository {
    constructor(
        @Inject('EMPLOYEE_MODEL')
    private employeeModel: Model<Employee>,
    ) {}

    async findById(id: string): Promise<Employee | null> {
        return await this.employeeModel.findById(id).exec()
    }

    async findManyEmployees({ startDate, endDate, role, isActive, page }: EmployeeParams): Promise<Employee[]> {
        const query: any = await this.employeeModel.find()

        if (startDate || endDate) {
            query.where('created_at');

            if (startDate) {
                query.gte(startDate.getTime());
              }
        
            if (endDate) {
                query.lte(endDate.getTime());
            }
        }

        if (role) {
            query.where('role').equals(role)
        }

        if (isActive !== undefined) {
            query.where('is_active').equals(isActive)
        }

        const currentPage = page || 1
        const limit = 10
        const skip = (currentPage - 1) * limit

        return query.skip(skip).limit(limit).exec()
    }

    async findByEmail(email: string): Promise<Employee | null> {
        return await this.employeeModel.findOne({ email, isActive: true }).exec()
    }

    async save(employee: Employee): Promise<void> {
        const id = employee.id.toString()

        return await this.employeeModel.findByIdAndUpdate(id, employee).exec()
    }

    async delete(employee: Employee): Promise<void> {
        const id = employee.id.toString()

        return await this.employeeModel.findByIdAndDelete(id).exec()
    }

    async create(employee: Employee): Promise<void> {
        return await this.employeeModel.create(employee)
    }    
}