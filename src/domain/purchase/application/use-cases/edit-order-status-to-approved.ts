import { OrdersRepository } from "../repositories/orders-repository";

import { Role } from "@/domain/purchase/enterprise/entities/employee";
import { Status } from "@/domain/purchase/enterprise/entities/order";

import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface EditOrderStatusToApprovedUseCaseRequest {
    employeeRole: Role,
    orderId: string
}

type EditOrderStatusToApprovedUseCaseResponse = Either<
    NotAllowedError | ResourceNotFoundError, 
    {
        message: string
    }
>

export class EditOrderStatusToApprovedUseCase {
    constructor(
        private ordesRepository: OrdersRepository
    ) {}

    async execute({ employeeRole, orderId }: EditOrderStatusToApprovedUseCaseRequest): Promise<EditOrderStatusToApprovedUseCaseResponse> {
        if (employeeRole !== Role.AUTHORIZER) {
            return left(new NotAllowedError())
        }

        const order = await this.ordesRepository.findById(orderId)

        if (!order) {
            return left(new ResourceNotFoundError())
        }

        if (order.status !== Status.OPEN && order.status !== Status.REJECTED) {
            return left(new NotAllowedError())
        }

        order.status = Status.AUTHORIZED

        await this.ordesRepository.save(order)

        return right({
            message: 'Order status has been changed to authorized.'
        })
    }
}