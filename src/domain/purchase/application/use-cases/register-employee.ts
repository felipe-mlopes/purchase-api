import { Either } from 'src/core/either';
import { Employee, Role } from '../../enterprise/entities/employee';
import { EmployeesRepository } from '../repositories/employees-repository';
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
  constructor(private employeesRepository: EmployeesRepository) {}

  async execute({
    name,
    role,
    email,
    password,
  }: RegisterEmployeeUseCaseRequest): Promise<RegisterEmployeeUseCaseResponse> {}
}
