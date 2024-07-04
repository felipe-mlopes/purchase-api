import { EmployeeParams, EmployeesRepository } from '@/domain/purchase/application/repositories/employees-repository';
import {
  Employee,
  Role,
} from '@/domain/purchase/enterprise/entities/employee';

export class InMemoryEmployeesRepository implements EmployeesRepository {
  public items: Employee[] = [];

  async findAll(page: number): Promise<Employee[]> {
    const employees = this.items.slice((page - 1) * 10, page * 10)
    
    return employees
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = this.items.find((item) => item.id.toString() === id);

    if (!employee) return null;

    return employee;
  } 

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = this.items.find((item) => item.email === email);

    if (!employee) return null;

    return employee;
  }

  async findManyEmployees({
    startDate,
    endDate,
    role,
    isActive,
    page
  }: EmployeeParams): Promise<Employee[]> {
    let employees = this.items

    if (startDate) {
      employees = employees.filter((item) => 
        item.createdAt >= startDate
      )
    }

    if (endDate) {
      employees = employees.filter((item) => 
        item.createdAt <= endDate
      )
    }

    if (role) {
      employees = employees.filter((item) => 
        item.role === role
      )
    }

    if (isActive !== undefined) {
      employees = employees.filter((item) => 
        item.isActive === isActive
      )
    }

    employees = employees.slice((page - 1) * 10, page * 10)

    return employees.map((item) =>
      Employee.create({
        name: item.name,
        role: item.role,
        isActive: item.isActive,
        email: item.email,
        password: item.password,
        createdAt: item.createdAt
      }),
    );
  }

  async save(employee: Employee): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === employee.id,
    );

    this.items[itemIndex] = employee;
  }

  async create(employee: Employee): Promise<void> {
    this.items.push(employee);
  }
}
