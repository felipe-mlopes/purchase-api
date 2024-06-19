import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export enum Role {
  REQUESTER = 'REQUESTER',
  AUTHORIZER = 'AUTHORIZER',
  PURCHASER = 'PURCHASER',
}

export interface EmployeeProps {
  name: string;
  role: Role;
  isActive: boolean;
  email: string;
  password: string;
}

export class Employee extends Entity<EmployeeProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get role() {
    return this.props.role;
  }

  set role(role: Role) {
    this.props.role = role;
  }

  get isActive() {
    return this.props.isActive;
  }

  set isActive(active: boolean) {
    this.props.isActive = active;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  static create(props: EmployeeProps, id?: UniqueEntityID) {
    const employee = new Employee(props, id);

    return employee;
  }
}
