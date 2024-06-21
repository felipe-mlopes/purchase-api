import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order } from '@/domain/purchase/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchOrdersCreatedByAuthorRequest {
  authorId: string;
  page: number;
}

type FetchOrdersCreatedByAuthorResponse = Either<
  NotAllowedError,
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
    page
  }: FetchOrdersCreatedByAuthorRequest): Promise<FetchOrdersCreatedByAuthorResponse> {
    const employee = await this.employeesRepository.findById(authorId);

    if (!employee) {
      return left(new NotAllowedError());
    }

    const orders = await this.ordersRepository.findManyByAuthor(authorId, { page });

    return right({
      orders,
    });
  }
}
