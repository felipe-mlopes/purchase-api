import { FetchEmployeesByRoleUseCase } from "./fetch-employees-by-role"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { makeEmployee } from "test/factories/make-employee"
import { Role } from "../../enterprise/entities/employee"

describe('Fetch Employees by Role', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let sut: FetchEmployeesByRoleUseCase

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new FetchEmployeesByRoleUseCase(inMemoryEmployeesRepository)
    })

    it('should be able to fetch employees by role', async () => {
        for(let i = 1; i <= 5; i++) {
            await inMemoryEmployeesRepository.create(
                makeEmployee({ role: Role.REQUESTER })
            )
        }

        await inMemoryEmployeesRepository.create(
            makeEmployee({ role: Role.AUTHORIZER })
        )

        await inMemoryEmployeesRepository.create(
            makeEmployee({ role: Role.PURCHASER })
        )

        const result = await sut.execute({
            role: Role.REQUESTER
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.employees).toHaveLength(5)
        }
    })
})