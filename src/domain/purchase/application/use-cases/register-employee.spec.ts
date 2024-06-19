import { RegisterEmployeeUseCase } from './register-employee';

import { Role } from '@/domain/purchase/enterprise/entities/employee';

import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository';

import { EmployeeAlreadyExistsError } from './errors/employee-already-exist-error';

describe('Register Employee', () => {
  let inMemoryEmployeesRepository: InMemoryEmployeesRepository;
  let fakeHasher: FakeHasher;
  let sut: RegisterEmployeeUseCase;

  beforeEach(async () => {
    inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterEmployeeUseCase(inMemoryEmployeesRepository, fakeHasher)
  });

  it('should be able to register a new employee', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@example.com',
      role: Role.REQUESTER,
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      employee: inMemoryEmployeesRepository.items[0],
    });
  });

  it('should not be able to register a new employee with email already exists', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john-doe@example.com',
      role: Role.REQUESTER,
      password: '123456',
    });

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@example.com',
      role: Role.REQUESTER,
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmployeeAlreadyExistsError)
  })

  it('should be able to hash employee password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john-doe@example.com',
      role: Role.REQUESTER,
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true);
    expect(inMemoryEmployeesRepository.items[0].password).toEqual(hashedPassword)
  })
});
