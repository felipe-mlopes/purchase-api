import { Order, Status } from '@/domain/purchase/enterprise/entities/order';

export interface OrderParams {
  startDate?: Date;
  endDate?: Date;
  authorName?: string;
  status?: Status;
  costCenter?: string;
  page?: number;
}

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findManyOrders(params: OrderParams): Promise<Order[]>;
  abstract findManyByAuthor(authorId: string, page: number): Promise<Order[]>;
  abstract findManyRecentByStatus(status: Status, page: number): Promise<Order[]>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
  abstract create(order: Order): Promise<void>;
}
