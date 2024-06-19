import { AuthenticateEmployeeUseCase } from "./authenticate-employee"

import { InMemoryEmployeesRepository } from "test/repositories/in-memory-employees-repository"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { makeEmployee } from "test/factories/make-employee"

import { WrongCredentialsError } from "./errors/wrong-credentials-error"

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

    it('should be able to authenticate an employee', async () => {
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

    it('should not be able to authenticate an employee without registration', async () => {
        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(WrongCredentialsError)
    })

    it('should not be able to authenticate an employee with an incompatible password', async () => {
        const employee = makeEmployee({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456'),
        })

        inMemoryEmployeesRepository.create(employee)

        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: 'abc123'
        })

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(WrongCredentialsError)
    })
})