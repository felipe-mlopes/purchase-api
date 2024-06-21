import { makeEmployee } from "test/factories/make-employee"
import { FetchOrdersWithOpenStatus } from "./fetch-orders-with-open-status"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { makeOrder } from "test/factories/make-order"

import { Role } from '@/domain/purchase/enterprise/entities/employee';
import { Status } from "@/domain/purchase/enterprise/entities/order";

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotAllowedError } from "@/core/errors/not-allowed-error"

describe('Fetch Orders With Open Status', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let sut: FetchOrdersWithOpenStatus

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        sut = new FetchOrdersWithOpenStatus(inMemoryOrdersRepository, inMemoryEmployeesRepository)
    })

    it('should be able to fecth orders with open status', async () => {
        const employeeRequest = makeEmployee({ role: Role.REQUESTER })
        const employeePurchaser = makeEmployee({ role: Role.PURCHASER })

        await inMemoryEmployeesRepository.create(employeeRequest)
        await inMemoryEmployeesRepository.create(employeePurchaser)

        const order01 = makeOrder({ authorId: employeeRequest.id, status: Status.OPEN, title: 'order-01' })
        const order02 = makeOrder({ authorId: employeeRequest.id, status: Status.AUTHORIZED })
        const order03 = makeOrder({ authorId: employeeRequest.id, status: Status.OPEN, title: 'order-03' })

        await inMemoryOrdersRepository.create(order01)
        await inMemoryOrdersRepository.create(order02)
        await inMemoryOrdersRepository.create(order03)

        const result = await sut.execute({
            employeeId: employeePurchaser.id.toString(),
            page: 1
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.orders).toHaveLength(2)
            expect(result.value.orders).toEqual([
                expect.objectContaining({ title: 'order-01' }),
                expect.objectContaining({ title: 'order-03' })
            ])
        }
    })

    it('should be able to paginated orders ', async () => {
        const employeeRequester = makeEmployee({ role: Role.REQUESTER })
        const employeePurchaser = makeEmployee({ role: Role.PURCHASER })

        await inMemoryEmployeesRepository.create(employeeRequester)
        await inMemoryEmployeesRepository.create(employeePurchaser)

        for (let i = 1; i <= 12; i++) {
            await inMemoryOrdersRepository.create(
              makeOrder({
                authorId: employeeRequester.id,
                status: Status.OPEN
              }),
            )
        }

        const result = await sut.execute({
            employeeId: employeePurchaser.id.toString(),
            page: 2
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
          expect(result.value?.orders).toHaveLength(2)
        }
    })

    it('should not be able to fetch orders without employee registration', async () => {
        const employeeId = new UniqueEntityID()
  
        const result = await sut.execute({
          employeeId: employeeId.toString(),
          page: 1
        })
  
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should not be able to fetch orders not being purchasion or authorization employees', async () => {
        const employee = makeEmployee({ role: Role.REQUESTER })

        await inMemoryEmployeesRepository.create(employee)

        const order = makeOrder({
            authorId: employee.id
        })

        await inMemoryOrdersRepository.create(order)
  
        const result = await sut.execute({
          employeeId: employee.id.toString(),
          page: 1
        })
  
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})