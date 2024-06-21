import { FetchOrdersCreatedByAuthor } from "./fetch-orders-created-by-author"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"
import { makeEmployee } from "test/factories/make-employee"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

describe('Fetch Orders Created By Author', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: FetchOrdersCreatedByAuthor

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new FetchOrdersCreatedByAuthor(inMemoryOrdersRepository, inMemoryEmployeesRepository)
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
        if (result.isRight()) {
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
        }
    })

    it('should be able to paginated orders ', async () => {
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

        if (result.isRight()) {
          expect(result.value?.orders).toHaveLength(2)
        }
    })

    it('should not be able to fetch orders without employee registration', async () => {
      const employeeId = new UniqueEntityID()

      const result = await sut.execute({
        authorId: employeeId.toString(),
        page: 1
      })

      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})