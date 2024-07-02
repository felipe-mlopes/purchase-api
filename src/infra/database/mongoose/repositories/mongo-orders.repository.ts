import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { OrderParams, OrdersRepository } from "@/domain/purchase/application/repositories/orders-repository"
import { Order, Status } from "@/domain/purchase/enterprise/entities/order";

@Injectable()
export class MongoOrdersRepository implements OrdersRepository {
    constructor(
        @Inject('ORDER_MODEL')
    private orderModel: Model<Order>,
    ) {}

    async findById(id: string): Promise<Order> {
        return await this.orderModel.findById(id).exec()
    }
    
    async findManyOrders({ 
        startDate, 
        endDate, 
        authorName, 
        status, 
        costCenter, 
        page 
    }: OrderParams): Promise<Order[]> {
        const query: any = await this.orderModel.find()

        if (startDate || endDate) {
            query.where('created_at');

            if (startDate) {
                query.gte(startDate.getTime());
              }
        
            if (endDate) {
                query.lte(endDate.getTime());
            }
        }

        if (authorName) {
            query.where('author_name').in(authorName)
        }

        if (status) {
            query.where('status').equals(status)
        }

        if (costCenter) {
            query.where('cost_center').equals(costCenter)
        }

        const currentPage = page || 1
        const limit = 10
        const skip = (currentPage - 1) * limit

        return query.skip(skip).limit(limit).exec()
    }

    async findManyByAuthor(authorId: string, page: number): Promise<Order[]> {
        const currentPage = page || 1
        const limit = 10
        const skip = (currentPage - 1) * limit

        return await this.orderModel.find({ authorId }).skip(skip).limit(limit).exec()
    }

    async findManyRecentByStatus(status: Status, page: number): Promise<Order[]> {
        const currentPage = page || 1
        const limit = 10
        const skip = (currentPage - 1) * limit

        return await this.orderModel.find({ status }).skip(skip).limit(limit).exec()
    }

    async save(order: Order): Promise<void> {
        const id = order.id.toString()

        return await this.orderModel.findByIdAndUpdate(id, order).exec()
    }

    async delete(order: Order): Promise<void> {
        const id = order.id.toString()

        return await this.orderModel.findByIdAndDelete(id).exec()
    }

    async create(order: Order): Promise<void> {
        return await this.orderModel.create(order)
    }
}