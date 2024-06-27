import { GetEmployeeByIdUseCase } from "./get-employee-by-id"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { makeEmployee } from "test/factories/make-employee"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

describe('Get Employee By Id', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let sut: GetEmployeeByIdUseCase

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new GetEmployeeByIdUseCase(inMemoryEmployeesRepository)
    })

    it('should be able to get employee by id', async () => {
        const employee = makeEmployee({
            name: 'John Doe'
        })

        await inMemoryEmployeesRepository.create(employee)

        const result = await sut.execute({
            employeeId: employee.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryEmployeesRepository.items[0].name).toBe('John Doe');
    })

    it('should not be able to get employee with id not exists', async () => {
        const id = new UniqueEntityID()
        
        const result = await sut.execute({
            employeeId: id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})