import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order, Status } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface FetchRecentOrderWithDoneUseCaseRequest {
  employeeId: string;
  employeeRole: Role;
  page: number;
}

type FetchRecentOrderWithDoneUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchRecentOrderWithDoneUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    employeeId,
    employeeRole,
    page,
  }: FetchRecentOrderWithDoneUseCaseRequest): Promise<FetchRecentOrderWithDoneUseCaseResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.PURCHASER) {
      return left(new NotAllowedError());
    }

    const statusDone = Status.DONE;

    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) return left(new NotAllowedError());

    const orders = await this.ordersRepository.findManyRecentByStatus(
      employeeId,
      statusDone,
      { page },
    );

    if (!orders) return left(new ResourceNotFoundError());

    return right({
      orders,
    });
  }
}
