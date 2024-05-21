import { Employee, Role } from '../../enterprise/entities/employee';

import { EmployeesRepository } from '../repositories/employees-repository';
import { HashGenerator } from '../../cryptography/hash-generator';

import { Either } from 'src/core/either';
import { EmployeeAlreadyExistsError } from './errors/employee-already-exist-error';

interface RegisterEmployeeUseCaseRequest {
  name: string;
  role: Role;
  email: string;
  password: string;
}

type RegisterEmployeeUseCaseResponse = Either<
  EmployeeAlreadyExistsError,
  {
    employee: Employee;
  }
>;

export class RegisterEmployeeUseCase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    role,
    email,
    password,
  }: RegisterEmployeeUseCaseRequest): Promise<RegisterEmployeeUseCaseResponse> {
    const employeeSameWithEmail =
      await this.employeesRepository.findByEmail(email);

    if (employeeSameWithEmail) {
      return left(new EmployeeAlreadyExistError(email));
    }

    const hashPassword = await this.hashGenerator.hash(password);

    const employee = Employee.create({
      name,
      role,
      email,
      password: hashPassword,
    });

    await this.employeesRepository.create(employee);

    return right({
      employee,
    });
  }
}
