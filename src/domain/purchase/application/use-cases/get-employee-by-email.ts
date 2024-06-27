import { Injectable } from "@nestjs/common";

import { Employee } from "@/domain/purchase/enterprise/entities/employee";

import { EmployeesRepository } from "../repositories/employees-repository";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface GetEmployeeByEmailUseCaseRequest {
    employeeEmail: string
}

type GetEmployeeByEmailUseCaseResponse = Either<
    ResourceNotFoundError, 
    {
    employee: Employee
    }
>

@Injectable()
export class GetEmployeeByEmailUseCase {
    constructor(private employeeRepository: EmployeesRepository) {}

    async execute({
        employeeEmail
    }: GetEmployeeByEmailUseCaseRequest): Promise<GetEmployeeByEmailUseCaseResponse> {
        const employee = await this.employeeRepository.findByEmail(employeeEmail)

        if (!employee) {
            return left(new ResourceNotFoundError())
        }

        return right({
            employee
        })
    }
}