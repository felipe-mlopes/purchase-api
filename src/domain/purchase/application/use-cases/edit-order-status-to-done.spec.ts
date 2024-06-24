import { EditOrderStatusToDoneUseCase } from "./edit-order-status-to-done";

import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"

import { Role } from '@/domain/purchase/enterprise/entities/employee';
import { Status } from "@/domain/purchase/enterprise/entities/order";

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

describe('Edit Order Status to Done', () => {
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: EditOrderStatusToDoneUseCase

    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new EditOrderStatusToDoneUseCase(inMemoryOrdersRepository)
    })

    it('should be able to edit order status to done', async () => {
        const order = makeOrder({
            status: Status.AUTHORIZED
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            employeeRole: Role.PURCHASER,
            orderId: order.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value.message).toEqual(expect.any(String))
    })

    it('should not be able to edit order status not being purchaser employee', async () => {
        const order = makeOrder({
            status: Status.AUTHORIZED
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            employeeRole: Role.AUTHORIZER,
            orderId: order.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to edit order status without registration', async () => {
        const orderId = new UniqueEntityID()

        const result = await sut.execute({
            employeeRole: Role.PURCHASER,
            orderId: orderId.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to edit order status when it is not approved', async () => {
        const order = makeOrder({
            status: Status.OPEN
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            employeeRole: Role.PURCHASER,
            orderId: order.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})