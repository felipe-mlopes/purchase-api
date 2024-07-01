import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { OrdersRepository } from "@/domain/purchase/application/repositories/orders-repository"
import { Order, Status } from "@/domain/purchase/enterprise/entities/order";

@Injectable()
export class MongoOrdersRepository implements OrdersRepository {
    constructor(
        @Inject('ORDER_MODEL')
    private orderModel: Model<Order>,
    ) {}

    findById(id: string): Promise<Order> {
        throw new Error("Method not implemented.");
    }
    findManyByAuthor(authorId: string, params: PaginationParams): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    findManyRecentByStatus(status: Status, params: PaginationParams): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    save(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
}