import { Role } from '../../enterprise/entities/employee';
import { RegisterEmployeeUseCase } from './register-employee';

import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository';

let inMemoryEmployeesRepository: InMemoryEmployeesRepository;
let fakeHasher: FakeHasher;
let sut: RegisterEmployeeUseCase;

describe('Register Employee', () => {
  beforeEach(() => {
    inMemoryEmployeesRepository = new InMemoryEmployeesRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterEmployeeUseCase(inMemoryEmployeesRepository, fakeHasher);
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
});
