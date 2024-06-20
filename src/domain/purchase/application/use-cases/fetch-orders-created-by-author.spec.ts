import { FetchOrdersCreatedByAuthor } from "./fetch-orders-created-by-author"

import { Role } from "@/domain/purchase/enterprise/entities/employee"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { makeEmployee } from "test/factories/make-employee"

describe('Fetch Orders Created By Author', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: FetchOrdersCreatedByAuthor

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new FetchOrdersCreatedByAuthor(inMemoryOrdersRepository)
    })

    it('should be able to fetch orders created by author', async () => {
        const employee = makeEmployee()

        await inMemoryEmployeesRepository.create(employee)
        
        const order01 = makeOrder({
            authorId: employee.id,
            title: 'order-01'
        })

        const order02 = makeOrder({
            authorId: employee.id,
            title: 'order-02'
        })

        await inMemoryOrdersRepository.create(order01)
        await inMemoryOrdersRepository.create(order02)

        const result = await sut.execute({
            authorId: employee.id.toString(),
            page: 1
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.orders).toHaveLength(2)
        expect(result.value?.orders).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                title: 'order-01'
              }),
              expect.objectContaining({
                title: 'order-02'
              }),
            ]),
        )
    })

    it('should not be able to fetch paginated orders ', async () => {
        const employee = makeEmployee()

        await inMemoryEmployeesRepository.create(employee)

        for (let i = 1; i <= 12; i++) {
            await inMemoryOrdersRepository.create(
              makeOrder({
                authorId: employee.id,
              }),
            )
        }

        const result = await sut.execute({
            authorId: employee.id.toString(),
            page: 2
        })

        expect(result.value?.orders).toHaveLength(2)
    })
})