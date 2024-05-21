import { EmployeesRepository } from 'src/domain/purchase/application/repositories/employees-repository';
import {
  Employee,
  Role,
} from 'src/domain/purchase/enterprise/entities/employee';

export class InMemoryEmployeesRepository implements EmployeesRepository {
  public items: Employee[] = [];

  async findById(id: string): Promise<Employee | null> {
    const employee = await this.items.find((item) => item.id.toString() === id);

    if (!employee) return null;

    return employee;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = await this.items.find((item) => item.email === email);

    if (!employee) return null;

    return employee;
  }

  async findByRole(role: Role): Promise<Employee[] | null> {
    const employee = await this.items.find((item) => item.role === role);

    if (!employee) return null;

    return employee.map((item) =>
      Employee.create({
        name: item.name,
        role: item.role,
        isActive: item.isActive,
        email: item.email,
        password: item.password,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    );
  }

  async save(employee: Employee): Promise<void> {
    const itemIndex = await this.items.findIndex(
      (item) => item.id === employee.id,
    );

    this.items[itemIndex] = employee;
  }

  async create(employee: Employee): Promise<void> {
    this.items.push(employee);
  }
}
