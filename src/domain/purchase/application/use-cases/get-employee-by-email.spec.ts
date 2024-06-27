import { GetEmployeeByEmailUseCase } from "./get-employee-by-email"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { makeEmployee } from "test/factories/make-employee"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

describe('Get Employee By Email', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let sut: GetEmployeeByEmailUseCase

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new GetEmployeeByEmailUseCase(inMemoryEmployeesRepository)
    })

    it('should be able to get employee by email', async () => {
        const employee = makeEmployee({
            name: 'John Doe',
            email: 'john-doe@example.com'
        })

        await inMemoryEmployeesRepository.create(employee)

        const result = await sut.execute({
            employeeEmail: employee.email
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryEmployeesRepository.items[0].name).toBe('John Doe');
    })

    it('should not be able to get employee with email not exists', async () => {
        const email = 'john-doe@example.com'
        
        const result = await sut.execute({
            employeeEmail: email
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})