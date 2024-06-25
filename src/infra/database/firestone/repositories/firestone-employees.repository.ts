import { Injectable } from "@nestjs/common";

import { EmployeesRepository } from "@/domain/purchase/application/repositories/employees-repository";
import { Employee } from "@/domain/purchase/enterprise/entities/employee";
import { FirestoreService } from "../firestone.service";

@Injectable()
export class FirestoreEmployeesRepository implements EmployeesRepository {
    constructor(private firestoreService: FirestoreService) {}

    firestone = this.firestoreService.getFirestoneInstance()

    async findById(id: string): Promise<Employee | null> {
        const employeeColletion = this.firestone.collection('employee')
        const employee = await employeeColletion.doc(id).get()

        if(!employee) {
            return null
        }

        
    }

    async findByEmail(email: string): Promise<Employee | null> {
        throw new Error("Method not implemented.");
    }

    async findByRole(email: string): Promise<Employee[]> {
        throw new Error("Method not implemented.");
    }

    async save(employee: Employee): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async create(employee: Employee): Promise<void> {
        throw new Error("Method not implemented.");
    }    
}