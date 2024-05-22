import { OrdersRepository } from '../repositories/orders-repository';

import { Order, Status } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface FetchOrdersWithOpenStatusRequest {
  employeeRole: Role;
}

type FetchOrdersWithOpenStatusResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchOrdersWithOpenStatus {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    employeeRole,
  }: FetchOrdersWithOpenStatusRequest): Promise<FetchOrdersWithOpenStatusResponse> {
    if (employeeRole !== Role.AUTHORIZER) {
      return left(new NotAllowedError());
    }

    const statusOpen = Status.OPEN;

    const orders = await this.ordersRepository.findManyByStatus(statusOpen);

    if (!orders) return left(new ResourceNotFoundError());

    return right({
      orders,
    });
  }
}
