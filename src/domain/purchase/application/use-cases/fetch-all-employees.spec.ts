import { FetchAllEmployeesUseCase } from "./fetch-all-employees"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { makeEmployee } from "test/factories/make-employee"

describe('Fetch All Employees', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let sut: FetchAllEmployeesUseCase

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new FetchAllEmployeesUseCase(inMemoryEmployeesRepository)
    })

    it('should be able to fetch all employees', async () => {
        for(let i = 1; i <= 10; i++) {
            await inMemoryEmployeesRepository.create(
                makeEmployee()
            )
        }

        const result = await sut.execute({
            page: 1
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.employees).toHaveLength(10)
        }
    })

    it('should be able to paginated employees ', async () => {
        for (let i = 1; i <= 12; i++) {
            await inMemoryEmployeesRepository.create(
                makeEmployee()
            )
        }

        const result = await sut.execute({
            page: 2
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
          expect(result.value?.employees).toHaveLength(2)
        }
    })
})