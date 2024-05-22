import { EmployeesRepository } from '../repositories/employees-repository';
import { OrdersRepository } from '../repositories/orders-repository';

import { Order } from '../../enterprise/entities/order';
import { Role } from '../../enterprise/entities/employee';

import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';


interface CreateOrderUseCaseRequest {
  employeeRole: Role;
  authorId: string;
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
    title,
    description,
    link,
    costCenter,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (employeeRole !== Role.AUTHORIZER || Role.REQUESTER) {
      return left(new NotAllowedError());
    }

    const employee = await this.employeesRepository.findById(authorId);

    const order = Order.create({
      authorId: employee.id,
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
