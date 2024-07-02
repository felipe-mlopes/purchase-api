import { Employee, Role } from '@/domain/purchase/enterprise/entities/employee';

export interface EmployeeParams {
  startDate?: Date;
  endDate?: Date;
  role?: Role;
  isActive?: boolean;
  page?: number;
}

export abstract class EmployeesRepository {
  abstract findById(id: string): Promise<Employee | null>;
  abstract findByEmail(email: string): Promise<Employee | null>;
  abstract findManyEmployees(params: EmployeeParams): Promise<Employee[]>;
  abstract save(employee: Employee): Promise<void>;
  abstract create(employee: Employee): Promise<void>;
}
