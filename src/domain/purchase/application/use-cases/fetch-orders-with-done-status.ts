import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order, Status } from '@/domain/purchase/enterprise/entities/order';
import { Role } from '@/domain/purchase/enterprise/entities/employee';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchOrderWithDoneUseCaseRequest {
  employeeId: string;
  page: number;
}

type FetchOrderWithDoneUseCaseResponse = Either<
  NotAllowedError,
  {
    orders: Order[];
  }
>;

export class FetchOrderWithDoneUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    employeeId,
    page,
  }: FetchOrderWithDoneUseCaseRequest): Promise<FetchOrderWithDoneUseCaseResponse> {
    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) {
      return left(new NotAllowedError());
    }

    if (employee.role !== Role.AUTHORIZER && employee.role !== Role.PURCHASER) {
      return left(new NotAllowedError());
    }

    const statusDone = Status.DONE;

    const orders = await this.ordersRepository.findManyRecentByStatus(
      statusDone,
      page,
    );

    return right({
      orders,
    });
  }
}
