import { EmployeesRepository } from '../repositories/employees-repository';
import { OrdersRepository } from '../repositories/orders-repository';

import { Order } from '@/domain/purchase/enterprise/entities/order';
import { Role } from '@/domain/purchase/enterprise/entities/employee';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';


interface CreateOrderUseCaseRequest {
  employeeRole: Role;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  link?: string | null;
  costCenter: string;
}

type CreateOrderUseCaseResponse = Either<
  NotAllowedError,
  {
    order: Order;
  }
>;

export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    employeeRole,
    authorId,
    authorName,
    title,
    description,
    link,
    costCenter,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (employeeRole !== Role.AUTHORIZER && employeeRole !== Role.REQUESTER) {
      return left(new NotAllowedError());
    }

    const employee = await this.employeesRepository.findById(authorId);

    if (!employee) {
      return left(new NotAllowedError());
    }

    const order = Order.create({
      authorId: employee.id,
      authorName,
      title,
      description,
      link,
      costCenter,
    });

    await this.ordersRepository.create(order);

    return right({
      order,
    });
  }
}
