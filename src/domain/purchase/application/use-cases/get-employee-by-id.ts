import { Injectable } from "@nestjs/common";

import { Employee } from "@/domain/purchase/enterprise/entities/employee";

import { EmployeesRepository } from "../repositories/employees-repository";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface GetEmployeeByIdUseCaseRequest {
    employeeId: string
}

type GetEmployeeByIdUseCaseResponse = Either<
    ResourceNotFoundError, 
    {
    employee: Employee
    }
>

@Injectable()
export class GetEmployeeByIdUseCase {
    constructor(private employeeRepository: EmployeesRepository) {}

    async execute({
        employeeId
    }: GetEmployeeByIdUseCaseRequest): Promise<GetEmployeeByIdUseCaseResponse> {
        const employee = await this.employeeRepository.findById(employeeId)

        if (!employee) {
            return left(new ResourceNotFoundError())
        }

        return right({
            employee
        })
    }
}