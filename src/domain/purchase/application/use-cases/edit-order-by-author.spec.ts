import { EditOrderByAuthorUseCase } from "./edit-order-by-author"

import { Role } from "@/domain/purchase/enterprise/entities/employee"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeEmployee } from "test/factories/make-employee"
import { makeOrder } from "test/factories/make-order"

import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

describe('Edit Order By Author', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: EditOrderByAuthorUseCase
    
    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new EditOrderByAuthorUseCase(inMemoryOrdersRepository, inMemoryEmployeesRepository)
    })

    it('should be to able to edit order by author', async () => {
        const employee = makeEmployee({
            role: Role.REQUESTER
        })

        await inMemoryEmployeesRepository.create(employee)

        const order = makeOrder({
            authorId: employee.id,
            description: 'Maintenance material'
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            orderId: order.id.toString(),
            authorId: employee.id.toString(),
            employeeRole: employee.role,
            description: 'Eletric material',
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryOrdersRepository.items[0].description).toEqual(order.description)
    })

    it('should not be able to edit an order being an employee buyer', async () => {
        const employee = makeEmployee({
            role: Role.PURCHASER
        })

        await inMemoryEmployeesRepository.create(employee)

        const order = makeOrder({
            authorId: employee.id,
            title: 'orderXX'
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            orderId: order.id.toString(),
            authorId: employee.id.toString(),
            employeeRole: employee.role,
            title: 'order-01',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to edit an order without employee registration', async () => {
        const employeeId = new UniqueEntityID()
        const orderId = new UniqueEntityID()

        const result = await sut.execute({
            orderId: orderId.toString(),
            authorId: employeeId.toString(),
            employeeRole: Role.REQUESTER,
            title: 'order-01',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to edit an order without being the author of it', async () => {
        const employee = makeEmployee({
            role: Role.REQUESTER
        })

        await inMemoryEmployeesRepository.create(employee)

        const order = makeOrder({
            authorId: new UniqueEntityID(),
            title: 'orderXX'
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            orderId: order.id.toString(),
            authorId: employee.id.toString(),
            employeeRole: employee.role,
            title: 'order-01',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})