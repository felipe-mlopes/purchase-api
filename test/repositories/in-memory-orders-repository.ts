import { PaginationParams } from '@/core/repositories/pagination-params';

import { OrdersRepository } from '@/domain/purchase/application/repositories/orders-repository';
import { Order, Status } from '@/domain/purchase/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) return null;

    return order;
  }

  async findManyByAuthor(authorId: string, { page }: PaginationParams): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.authorId.toString() === authorId)
      .slice((page - 1) * 10, page * 10)

    return orders;
  }

  async findManyRecentByStatus(status: Status, { page }: PaginationParams): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.status === status)
      .slice((page - 1) * 10, page * 10)

    return orders;
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === order.id,
    );

    this.items[itemIndex] = order;
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === order.id,
    );

    this.items.splice(itemIndex, 1)
  }

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }
}
