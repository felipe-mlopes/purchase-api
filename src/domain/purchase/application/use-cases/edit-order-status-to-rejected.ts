import { OrdersRepository } from "../repositories/orders-repository";

import { Role } from "@/domain/purchase/enterprise/entities/employee";
import { Status } from "@/domain/purchase/enterprise/entities/order";

import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface EditOrderStatusToRejectedUseCaseRequest {
    employeeRole: Role,
    orderId: string
}

type EditOrderStatusToRejectedUseCaseResponse = Either<
    NotAllowedError | ResourceNotFoundError, 
    {
        message: string
    }
>

export class EditOrderStatusToRejectedUseCase {
    constructor(
        private ordesRepository: OrdersRepository
    ) {}

    async execute({ employeeRole, orderId }: EditOrderStatusToRejectedUseCaseRequest): Promise<EditOrderStatusToRejectedUseCaseResponse> {
        if (employeeRole !== Role.AUTHORIZER) {
            return left(new NotAllowedError())
        }

        const order = await this.ordesRepository.findById(orderId)

        if (!order) {
            return left(new ResourceNotFoundError())
        }

        if (order.status !== Status.OPEN) {
            return left(new NotAllowedError())
        }

        order.status = Status.REJECTED

        await this.ordesRepository.save(order)

        return right({
            message: 'Order status has been changed to rejected.'
        })
    }
}