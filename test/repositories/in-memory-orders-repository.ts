import { OrdersRepository } from 'src/domain/purchase/application/repositories/orders-repository';
import { Order, Status } from 'src/domain/purchase/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = await this.items.find((item) => item.id.toString() === id);

    if (!order) return null;

    return order;
  }

  async findManyByAuthor(authorId: string): Promise<Order[] | null> {
    const orders = await this.items.filter(
      (item) => item.authorId.toString() === authorId,
    );

    if (!orders) return null;

    return orders;
  }

  async findManyByStatus(status: Status): Promise<Order[] | null> {
    const orders = await this.items.filter((item) => item.status === status);

    if (!orders) return null;

    return orders;
  }

  async save(order: Order): Promise<void> {
    const itemIndex = await this.items.findIndex(
      (item) => item.id === order.id,
    );

    this.items[itemIndex] = order;
  }

  async delete(order: Order): Promise<void> {
    await this.items.filter((item) => item.id !== order.id);
  }

  async create(order: Order): Promise<void> {
    await this.items.push(order);
  }
}
