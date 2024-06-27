import { Employee, Role } from "@/domain/purchase/enterprise/entities/employee";

import { EmployeesRepository } from "../repositories/employees-repository";

import { Either, right } from "@/core/either";

interface FetchEmployeesByRoleUseCaseRequest {
    role: Role
}

type FetchEmployeesByRoleUseCaseResponse = Either<
    null, {
        employees: Employee[]
    }
>

export class FetchEmployeesByRoleUseCase {
    constructor(private employeesRepository: EmployeesRepository) {}

    async execute({
        role
    }: FetchEmployeesByRoleUseCaseRequest): Promise<FetchEmployeesByRoleUseCaseResponse> {
        const employees = await this.employeesRepository.findByRole(role)
        
        return right({
            employees
        })
    }
}