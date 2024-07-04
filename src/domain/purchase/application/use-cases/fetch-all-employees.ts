import { Injectable } from "@nestjs/common";

import { Employee, Role } from "@/domain/purchase/enterprise/entities/employee";

import { EmployeesRepository } from "../repositories/employees-repository";

import { Either, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface FetchAllEmployeesUseCaseRequest {
    startDate?: Date;
    endDate?: Date;
    role?: Role;
    isActive?: boolean;
    page: number;
}

type FetchAllEmployeesUseCaseResponse = Either<
    ResourceNotFoundError, 
    {
    employees: Employee[]
    }
>

@Injectable()
export class FetchAllEmployeesUseCase {
    constructor(private employeeRepository: EmployeesRepository) {}

    async execute({
        startDate,
        endDate,
        role,
        isActive,
        page
    }: FetchAllEmployeesUseCaseRequest): Promise<FetchAllEmployeesUseCaseResponse> {
        const employees = await this.employeeRepository.findManyEmployees({
            startDate,
            endDate,
            role,
            isActive,
            page
        })

        return right({
            employees
        })
    }
}