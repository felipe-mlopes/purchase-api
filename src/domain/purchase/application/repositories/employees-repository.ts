import { Employee, Role } from '@/domain/purchase/enterprise/entities/employee';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class EmployeesRepository {
  abstract findById(id: string): Promise<Employee | null>;
  abstract findAll(params: PaginationParams): Promise<Employee[]>;
  abstract findByEmail(email: string): Promise<Employee | null>;
  abstract findByRole(role: Role): Promise<Employee[]>;
  abstract save(employee: Employee): Promise<void>;
  abstract create(employee: Employee): Promise<void>;
}
