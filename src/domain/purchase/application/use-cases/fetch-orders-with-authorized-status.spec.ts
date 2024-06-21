import { FetchOrdersWithAuthorizedStatus } from "./fetch-orders-with-authorized-status"

import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository"
import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { makeEmployee } from "test/factories/make-employee"
import { makeOrder } from "test/factories/make-order";

import { Role } from '@/domain/purchase/enterprise/entities/employee';
import { Status } from "@/domain/purchase/enterprise/entities/order";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

describe('Fetch Orders With Authorized Status', () => {
    let inMemoryOrdersRepository: InMemoryOrdersRepository
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let sut: FetchOrdersWithAuthorizedStatus

    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        sut = new FetchOrdersWithAuthorizedStatus(inMemoryOrdersRepository, inMemoryEmployeesRepository)
    })

    it('should be able to fetch orders with autorized status', async () => {
        const employeeRequester = makeEmployee({
            role: Role.REQUESTER
        })

        const employeePurchase = makeEmployee({
            role: Role.PURCHASER
        })

        await inMemoryEmployeesRepository.create(employeeRequester)
        await inMemoryEmployeesRepository.create(employeePurchase)

        const order01 = makeOrder({
            authorId: employeeRequester.id,
            status: Status.AUTHORIZED,
            title: 'order-01'
        })

        const order02 = makeOrder({
            authorId: employeeRequester.id,
            status: Status.OPEN
        })

        await inMemoryOrdersRepository.create(order01)
        await inMemoryOrdersRepository.create(order02)

        const result = await sut.execute({
            employeeId: employeePurchase.id.toString(),
            page: 1
        })

        expect(result.isRight()).toBe(true)
        if (result.isRight()) {
            expect(result.value.orders).toHaveLength(1)
            expect(result.value.orders).toEqual([
                expect.objectContaining({ title: 'order-01' })
            ])
        }
    })

    it('should be able to paginated orders ', async () => {
        const employeeRequester = makeEmployee({
            role: Role.REQUESTER
        })

        const employeePurchase = makeEmployee({
            role: Role.PURCHASER
        })

        await inMemoryEmployeesRepository.create(employeeRequester)
        await inMemoryEmployeesRepository.create(employeePurchase)

        for (let i = 1; i <= 12; i++) {
            await inMemoryOrdersRepository.create(
              makeOrder({
                authorId: employeeRequester.id,
                status: Status.AUTHORIZED
              }),
            )
        }

        const result = await sut.execute({
            employeeId: employeePurchase.id.toString(),
            page: 2
        })

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
        const employee = makeEmployee({
            role: Role.REQUESTER
        })

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