import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order, OrderProps } from "@/domain/purchase/enterprise/entities/order";
import { faker } from "@faker-js/faker";

export function makeOrder(
    override: Partial<OrderProps> = {},
    id?: UniqueEntityID
) {
    const order = Order.create(
        {
            title: faker.lorem.word(),
            authorId: new UniqueEntityID(),
            costCenter: 'Maintenance',
            description: faker.lorem.text(),
            ...override
        },
        id
    )

    return order
}