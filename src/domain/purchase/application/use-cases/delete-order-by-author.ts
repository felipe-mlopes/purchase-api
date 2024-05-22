import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface DeleteOrderByAuthorUseCaseRequest {
  orderId: string;
  authorId: string;
  employeeRole: Role;
}

type DeleteOrderByAuthorUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    message: string;
  }
>;

export class DeleteOrderByAuthorUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    orderId,
    authorId,
    employeeRole,
  }: DeleteOrderByAuthorUseCaseRequest): Promise<DeleteOrderByAuthorUseCaseResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.REQUESTER) {
      return left(new NotAllowedError());
    }

    const employee = await this.employeesRepository.findById(authorId);

    if (!employee) return left(new NotAllowedError());

    const order = await this.ordersRepository.findById(orderId);

    if (!order) return left(new ResourceNotFoundError());

    await this.ordersRepository.delete(order);

    return right({
      message: 'The order has been successfully removed.',
    });
  }
}
