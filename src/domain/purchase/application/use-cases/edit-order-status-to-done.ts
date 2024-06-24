import { OrdersRepository } from "../repositories/orders-repository";

import { Role } from "@/domain/purchase/enterprise/entities/employee";
import { Status } from "@/domain/purchase/enterprise/entities/order";

import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface EditOrderStatusToDoneUseCaseRequest {
    employeeRole: Role,
    orderId: string
}

type EditOrderStatusToDoneUseCaseResponse = Either<
    NotAllowedError | ResourceNotFoundError, 
    {
        message: string
    }
>

export class EditOrderStatusToDoneUseCase {
    constructor(
        private ordesRepository: OrdersRepository
    ) {}

    async execute({ employeeRole, orderId }: EditOrderStatusToDoneUseCaseRequest): Promise<EditOrderStatusToDoneUseCaseResponse> {
        if (employeeRole !== Role.PURCHASER) {
            return left(new NotAllowedError())
        }

        const order = await this.ordesRepository.findById(orderId)

        if (!order) {
            return left(new ResourceNotFoundError())
        }

        if (order.status !== Status.AUTHORIZED) {
            return left(new NotAllowedError())
        }

        order.status = Status.DONE

        await this.ordesRepository.save(order)

        return right({
            message: 'Order status has been changed to completed.'
        })
    }
}