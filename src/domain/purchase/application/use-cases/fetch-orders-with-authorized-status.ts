import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order, Status } from '@/domain/purchase/enterprise/entities/order';
import { Role } from '@/domain/purchase/enterprise/entities/employee';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchOrdersWithAuthorizedStatusRequest {
  employeeId: string;
  page: number;
}

type FetchOrdersWithAuthorizedStatusResponse = Either<
  NotAllowedError,
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
    page,
  }: FetchOrdersWithAuthorizedStatusRequest): Promise<FetchOrdersWithAuthorizedStatusResponse> {
    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) {
      return left(new NotAllowedError());
    }

    if (employee.role !== Role.AUTHORIZER && employee.role !== Role.PURCHASER) {
      return left(new NotAllowedError());
    }

    const statusAuthorized = Status.AUTHORIZED;

    const orders = await this.ordersRepository.findManyRecentByStatus(
      statusAuthorized,
      page,
    );

    return right({
      orders,
    });
  }
}
