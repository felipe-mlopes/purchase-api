import { AuthenticateEmployeeUseCase } from "./authenticate-employee"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { Role } from "../../enterprise/entities/employee"
import { makeEmployee } from "test/factories/make-employee"

describe('Authenticate Employee', () => {
    let inMemoryEmployeesRepository: InMemoryEmployeesRepository
    let fakeHasher: FakeHasher
    let fakeEncrypter: FakeEncrypter
    let sut: AuthenticateEmployeeUseCase

    beforeEach(() => {
        inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        sut = new AuthenticateEmployeeUseCase(inMemoryEmployeesRepository, fakeHasher, fakeEncrypter)
    })

    it('should be able authenticate ', async () => {
        const employee = makeEmployee({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456'),
        })

        inMemoryEmployeesRepository.create(employee)

        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
    })
})