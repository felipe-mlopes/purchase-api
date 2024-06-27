import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { GetOrderByIdUseCase } from "./get-order-by-id"
import { makeOrder } from "test/factories/make-order"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error"

describe('', () => {
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: GetOrderByIdUseCase

    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
    })

    it('should be able to get order by id', async () => {
        const order = makeOrder({
            title: 'order-01'
        })

        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            orderId: order.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryOrdersRepository.items[0].title).toEqual('order-01')
    })

    it('should not be able to get order with id not exists', async () => {
        const id = new UniqueEntityID()

        const result = await sut.execute({
            orderId: id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    })
})