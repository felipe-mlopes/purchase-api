import { CreateOrderUseCase } from "./create-order"
import { Role } from "@/domain/purchase/enterprise/entities/employee"

import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { makeEmployee } from "test/factories/make-employee"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

describe('Create Order', () => {
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let sut: CreateOrderUseCase

    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new CreateOrderUseCase(inMemoryOrdersRepository, inMemoryEmployeesRepository)
    })

    it('should be able to create a new order', async () => {
        const employee = makeEmployee({
            role: Role.AUTHORIZER
        })

        await inMemoryEmployeesRepository.create(employee)
        
        const result = await sut.execute({
            authorId: employee.id.toString(),
            authorName: employee.name,
            title: 'order-01',
            costCenter: 'Maintenance',
            description: 'Maintenance material',
            employeeRole: employee.role,
            link: ''
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            order: inMemoryOrdersRepository.items[0]
        })
    })

    it('should not be able to create an order being an employee buyer', async () => {
        const employee = makeEmployee({
            role: Role.PURCHASER
        })

        await inMemoryEmployeesRepository.create(employee)
        
        const result = await sut.execute({
            authorId: employee.id.toString(),
            authorName: employee.name,
            title: 'order-01',
            costCenter: 'Maintenance',
            description: 'Maintenance material',
            employeeRole: employee.role,
            link: ''
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to create without employee registration', async () => {
        const employeeId = new UniqueEntityID()

        const result = await sut.execute({
            authorId: employeeId.toString(),
            authorName: 'john doe',
            title: 'order-01',
            costCenter: 'Maintenance',
            description: 'Maintenance material',
            employeeRole: Role.REQUESTER,
            link: ''
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})