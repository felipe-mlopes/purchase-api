import { OrdersRepository } from '../repositories/orders-repository';
import { EmployeesRepository } from '../repositories/employees-repository';

import { Order } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface EditOrderByAuthorUseCaseRequest {
  orderId: string;
  authorId: string;
  employeeRole: Role;
  title?: string;
  description?: string;
  link?: string;
  costCenter?: string;
}

type EditOrderByAuthorUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order;
  }
>;

export class EditOrderByAuthorUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute({
    orderId,
    authorId,
    employeeRole,
    title,
    description,
    link,
    costCenter,
  }: EditOrderByAuthorUseCaseRequest): Promise<EditOrderByAuthorUseCaseResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.REQUESTER) {
      return left(new NotAllowedError());
    }

    const employee = await this.employeesRepository.findById(authorId);

    if (!employee) return left(new NotAllowedError());

    const order = await this.ordersRepository.findById(orderId);

    if (!order) return left(new ResourceNotFoundError());

    order.title = title ?? order.title;
    order.description = description ?? order.description;
    order.link = link ?? order.link;
    order.costCenter = costCenter ?? order.costCenter;

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
