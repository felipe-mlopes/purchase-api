import { Order, Status } from '../../enterprise/entities/order';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findManyByAuthor(authorId: string, params: PaginationParams): Promise<Order[]>;
  abstract findManyRecentByStatus(status: Status, params: PaginationParams): Promise<Order[]>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
  abstract create(order: Order): Promise<void>;
}
