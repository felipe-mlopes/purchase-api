import { OrdersRepository } from '../repositories/orders-repository';

import { Order, Status } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface FetchOrdersWithAuthorizedStatusRequest {
  employeeRole: Role;
}

type FetchOrdersWithAuthorizedStatusResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchOrdersWithAuthorizedStatus {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    employeeRole,
  }: FetchOrdersWithAuthorizedStatusRequest): Promise<FetchOrdersWithAuthorizedStatusResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.PURCHASER) {
      return left(new NotAllowedError());
    }

    const statusAuthorized = Status.AUTHORIZED;

    const orders =
      await this.ordersRepository.findManyByStatus(statusAuthorized);

    if (!orders) return left(new ResourceNotFoundError());

    return right({
      orders,
    });
  }
}
