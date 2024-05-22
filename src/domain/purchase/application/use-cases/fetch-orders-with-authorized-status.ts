import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order, Status } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface FetchOrdersWithAuthorizedStatusRequest {
  employeeId: string;
  employeeRole: Role;
  page: number;
}

type FetchOrdersWithAuthorizedStatusResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchOrdersWithAuthorizedStatus {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    employeeId,
    employeeRole,
    page,
  }: FetchOrdersWithAuthorizedStatusRequest): Promise<FetchOrdersWithAuthorizedStatusResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.PURCHASER) {
      return left(new NotAllowedError());
    }

    const statusAuthorized = Status.AUTHORIZED;

    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) return left(new NotAllowedError());

    const orders = await this.ordersRepository.findManyRecentByStatus(
      employeeId,
      statusAuthorized,
      { page },
    );

    if (!orders) return left(new ResourceNotFoundError());

    return right({
      orders,
    });
  }
}
