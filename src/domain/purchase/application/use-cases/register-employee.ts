import { Employee, Role } from '@/domain/purchase/enterprise/entities/employee';

import { EmployeesRepository } from '../repositories/employees-repository';
import { HashGenerator } from '@/domain/purchase/cryptography/hash-generator';

import { Either, left, right } from '@/core/either';
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
    const employeeSameWithEmail = await this.employeesRepository.findByEmail(email);

    if (employeeSameWithEmail) { 
      return left(new EmployeeAlreadyExistsError(email)) 
    }

    const hashPassword = await this.hashGenerator.hash(password);

    const employee = Employee.create({
      name,
      role,
      email,
      isActive: true,
      password: hashPassword
    });

    await this.employeesRepository.create(employee);

    return right({
      employee,
    });
  }
}
