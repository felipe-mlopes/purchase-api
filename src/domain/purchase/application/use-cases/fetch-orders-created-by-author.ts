import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface FetchOrdersCreatedByAuthorRequest {
  authorId: string;
  employeeRole: Role;
}

type FetchOrdersCreatedByAuthorResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchOrdersCreatedByAuthor {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    authorId,
    employeeRole,
  }: FetchOrdersCreatedByAuthorRequest): Promise<FetchOrdersCreatedByAuthorResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.REQUESTER) {
      return left(new NotAllowedError());
    }

    const orders = await this.ordersRepository.findManyByAuthor(authorId);

    if (!orders) return left(new ResourceNotFoundError());

    return right({
      orders,
    });
  }
}
