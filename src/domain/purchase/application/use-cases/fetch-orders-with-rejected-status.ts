import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order, Status } from '@/domain/purchase/enterprise/entities/order';
import { Role } from '@/domain/purchase/enterprise/entities/employee';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchOrdersWithRejectedStatusRequest {
  employeeId: string;
  page: number;
}

type FetchOrdersWithRejectedStatusResponse = Either<
  NotAllowedError,
  {
    orders: Order[];
  }
>;

export class FetchOrdersWithRejectedStatus {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    employeeId,
    page,
  }: FetchOrdersWithRejectedStatusRequest): Promise<FetchOrdersWithRejectedStatusResponse> {
    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) {
      return left(new NotAllowedError());
    }

    if (employee.role !== Role.AUTHORIZER && employee.role !== Role.PURCHASER) {
      return left(new NotAllowedError());
    }

    const statusRejected = Status.REJECTED;

    const orders = await this.ordersRepository.findManyRecentByStatus(
      statusRejected,
      { page },
    );

    return right({
      orders,
    });
  }
}
