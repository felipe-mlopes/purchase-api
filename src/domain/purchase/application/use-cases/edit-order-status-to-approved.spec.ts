import { EditOrderStatusToApprovedUseCase } from "./edit-order-status-to-approved"

import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"

import { Role } from '@/domain/purchase/enterprise/entities/employee';
import { Status } from "@/domain/purchase/enterprise/entities/order";

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

describe('Edit Order Status to Approved', () => {
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: EditOrderStatusToApprovedUseCase

    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new EditOrderStatusToApprovedUseCase(inMemoryOrdersRepository)
    })

    it('should be able to edit order status to approved', async () => {
        const order = makeOrder({
            status: Status.OPEN
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            employeeRole: Role.AUTHORIZER,
            orderId: order.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(result.value.message).toEqual(expect.any(String))
    })

    it('should not be able to edit order status not being authorizer employee', async () => {
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

    it('should not be able to edit order status without registration', async () => {
        const orderId = new UniqueEntityID()

        const result = await sut.execute({
            employeeRole: Role.AUTHORIZER,
            orderId: orderId.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to edit order status when it is not open or rejected', async () => {
        const order = makeOrder({
            status: Status.DONE
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            employeeRole: Role.AUTHORIZER,
            orderId: order.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})