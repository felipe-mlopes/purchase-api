import { OrderParams, OrdersRepository } from '@/domain/purchase/application/repositories/orders-repository';
import { Order, Status } from '@/domain/purchase/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) return null;

    return order;
  }

  async findManyOrders({
    startDate,
    endDate,
    authorName,
    costCenter,
    status,
    page
  }: OrderParams): Promise<Order[]> {
    let orders = this.items

    if (startDate) {
      orders = orders.filter((item) => 
        item.createdAt >= startDate
      )
    }

    if (endDate) {
      orders = orders.filter((item) => 
        item.createdAt <= endDate
      )
    }

    if (authorName) {
      orders = orders.filter((item) => 
        item.authorName === authorName
      )
    }

    if (costCenter) {
      orders = orders.filter((item) => 
        item.costCenter === costCenter
      )
    }

    if (status) {
      orders = orders.filter((item) => 
        item.status === status
      )
    }

    orders = orders.slice((page - 1) * 10, page * 10)

      return orders.map(item => 
        Order.create({
          authorId: item.authorId,
          authorName: item.authorName,
          title: item.title,
          description: item.description,
          costCenter: item.costCenter,
          link: item.link,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          authorizedAt: item.authorizedAt,
          rejectedAt: item.rejectedAt,
          completedAt: item.completedAt,
        })
      )
   }

  async findManyByAuthor(authorId: string, page: number): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.authorId.toString() === authorId)
      .slice((page - 1) * 10, page * 10)

    return orders;
  }

  async findManyRecentByStatus(status: Status, page: number): Promise<Order[]> {
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
