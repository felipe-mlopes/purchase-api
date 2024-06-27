import { Injectable } from "@nestjs/common";

import { Order } from "@/domain/purchase/enterprise/entities/order";

import { OrdersRepository } from "../repositories/orders-repository";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface GetOrderByIdUseCaseRequest {
    orderId: string
}

type GetOrderByIdUseCaseResponse = Either<
    ResourceNotFoundError, {
        order: Order
    }
>

@Injectable()
export class GetOrderByIdUseCase {
    constructor(private ordersRepository: OrdersRepository) {}

    async execute({
        orderId
    }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
        const order = await this.ordersRepository.findById(orderId)

        if (!order) {
            return left(new ResourceNotFoundError())
        }

        return right({
            order
        })
    }
}