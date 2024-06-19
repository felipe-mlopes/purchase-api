import { faker } from '@faker-js/faker'

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Employee, EmployeeProps, Role } from "@/domain/purchase/enterprise/entities/employee";

export function makeEmployee(
    override: Partial<EmployeeProps> = {},
    id?: UniqueEntityID
) {
    const employee = Employee.create(
        {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            isActive: true,
            role: Role.REQUESTER,
            password: faker.string.alphanumeric(6),
            ...override
        },
        id
    )

    return employee
}