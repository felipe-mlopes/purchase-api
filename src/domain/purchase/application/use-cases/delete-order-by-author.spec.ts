import { DeleteOrderByAuthorUseCase } from "./delete-order-by-author"

import { Role } from "@/domain/purchase/enterprise/entities/employee"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeEmployee } from "test/factories/make-employee"
import { makeOrder } from "test/factories/make-order"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

describe('Delete Order By Author', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: DeleteOrderByAuthorUseCase

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new DeleteOrderByAuthorUseCase(inMemoryOrdersRepository, inMemoryEmployeesRepository)
    })

    it('should be to able to delete order by author', async () => {
        const employee = makeEmployee({
            role: Role.REQUESTER
        })

        await inMemoryEmployeesRepository.create(employee)

        const order = makeOrder({
            authorId: employee.id
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            authorId: employee.id.toString(),
            employeeRole: employee.role,
            orderId: order.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryOrdersRepository.items).toHaveLength(0)
    })

    it('should not be able to delete an order being an employee buyer', async () => {
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
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to delete an order without employee registration', async () => {
        const employeeId = new UniqueEntityID()
        const orderId = new UniqueEntityID()

        const result = await sut.execute({
            orderId: orderId.toString(),
            authorId: employeeId.toString(),
            employeeRole: Role.REQUESTER,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to delete a non-existent order', async () => {
        const employee = makeEmployee({
            role: Role.REQUESTER
        })

        await inMemoryEmployeesRepository.create(employee)

        const orderId = new UniqueEntityID()

        const result = await sut.execute({
            orderId: orderId.toString(),
            authorId: employee.id.toString(),
            employeeRole: employee.role,
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to delete an order without being the author of it', async () => {
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
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})