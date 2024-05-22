import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order, Status } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface FetchOrdersWithOpenStatusRequest {
  employeeId: string;
  employeeRole: Role;
  page: number;
}

type FetchOrdersWithOpenStatusResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchOrdersWithOpenStatus {
  constructor(private ordersRepository: OrdersRepository, private employeesRepository: EmployeesRepository,) {}

  async execute({
    employeeId,
    employeeRole,
    page,
  }: FetchOrdersWithOpenStatusRequest): Promise<FetchOrdersWithOpenStatusResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.PURCHASER) {
      return left(new NotAllowedError());
    }

    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) return left(new NotAllowedError());

    const statusOpen = Status.OPEN;

    const orders = await this.ordersRepository.findManyRecentByStatus(
      employeeId,
      statusOpen,
      { page },
    );

    if (!orders) return left(new ResourceNotFoundError());

    return right({
      orders,
    });
  }
}
