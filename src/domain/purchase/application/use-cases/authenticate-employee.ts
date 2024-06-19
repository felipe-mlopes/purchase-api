import { EmployeesRepository } from '../repositories/employees-repository';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Encrypter } from '../../cryptography/encrypter';

import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateEmployeeUsecaseRequest {
  email: string;
  password: string;
}

type AuthenticateEmployeeUsecaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

export class AuthenticateEmployeeUseCase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateEmployeeUsecaseRequest): Promise<AuthenticateEmployeeUsecaseResponse> {
    const employee = await this.employeesRepository.findByEmail(email);

    if (!employee) return left(new WrongCredentialsError());

    const isPasswordValid = await this.hashComparer.compare(
      password,
      employee.password,
    );

    if (!isPasswordValid) return left(new WrongCredentialsError());

    const accessToken = await this.encrypter.encrypt({
      sub: employee.id.toString(),
      name: employee.name,
      role: employee.role,
    });

    return right({
      accessToken,
    });
  }
}
