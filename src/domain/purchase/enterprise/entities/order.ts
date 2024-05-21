import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export enum Status {
  OPEN = 'OPEN',
  AUTHORIZED = 'AUTHORIZED',
  DONE = 'DONE',
}

interface OrderProps {
  authorId: UniqueEntityID;
  title: string;
  description: string;
  link?: string | null;
  costCenter: string;
  status: Status;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
  get authorId() {
    return this.props.authorId;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  get link() {
    return this.props.link;
  }

  set link(link: string | undefined | null) {
    this.props.link = link;
    this.touch();
  }

  get costCenter() {
    return this.props.costCenter;
  }

  set costCenter(costCenter: string) {
    this.props.costCenter = costCenter;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(status: Status) {
    if (Object.values(Status).includes(status)) {
      this.props.status = status;
      this.touch();
    }
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<OrderProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? Status.OPEN,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
