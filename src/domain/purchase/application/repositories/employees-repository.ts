import { Employee } from '../../enterprise/entities/employee';

export abstract class EmployeesRepository {
  abstract findById(id: string): Promise<Employee | null>;
  abstract findByEmail(email: string): Promise<Employee | null>;
  abstract findByRole(email: string): Promise<Employee[] | null>;
  abstract save(employee: Employee): Promise<void>;
  abstract create(employee: Employee): Promise<void>;
}
