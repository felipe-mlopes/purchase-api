import { OrdersRepository } from '../repositories/orders-repository';

import { Order } from '@/domain/purchase/enterprise/entities/order';
import { Role } from '@/domain/purchase/enterprise/entities/employee';

import { Either, right } from '@/core/either';

interface FetchOrdersCreatedByAuthorRequest {
  authorId: string;
  page: number;
}

type FetchOrdersCreatedByAuthorResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

export class FetchOrdersCreatedByAuthor {
  constructor(
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    authorId,
    page
  }: FetchOrdersCreatedByAuthorRequest): Promise<FetchOrdersCreatedByAuthorResponse> {
    const orders = await this.ordersRepository.findManyByAuthor(authorId, { page });

    return right({
      orders,
    });
  }
}
