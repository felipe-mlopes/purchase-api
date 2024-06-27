import { Injectable } from "@nestjs/common";

import { Employee } from "@/domain/purchase/enterprise/entities/employee";

import { EmployeesRepository } from "../repositories/employees-repository";

import { Either, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface FetchAllEmployeesUseCaseRequest {
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
        page
    }: FetchAllEmployeesUseCaseRequest): Promise<FetchAllEmployeesUseCaseResponse> {
        const employees = await this.employeeRepository.findAll({
            page
        })

        return right({
            employees
        })
    }
}