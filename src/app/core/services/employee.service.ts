import { Injectable } from '@angular/core';
import { Employee } from '../models/Employee.model';
import { environment } from 'src/environments/environment';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageProps } from '../enums/enums';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${environment.serverUrl}/employees.json`
    );
  }

  findById(id: number): Observable<Employee | undefined> {
    return this.findAll().pipe(
      map((employees) => employees.find((employee) => employee.id === id))
    );
  }

  addEmployee(employee: Employee): Observable<Employee | undefined> {
    let employees = JSON.parse(this.storage.getItem(StorageProps.EMPLOYEES)!);
    employees.push(employee);
    this.storage.setItem(StorageProps.EMPLOYEES, employees);
    return this.findById(employee.id);
  }

  updateEmployee(employee: Employee) {
    let employees: Employee[] = JSON.parse(
      this.storage.getItem(StorageProps.EMPLOYEES)!
    );
    let index = employees.findIndex((e) => e.id === employee.id);
    employees.splice(index, 1, employee);
    this.storage.setItem(StorageProps.EMPLOYEES, JSON.stringify(employees));
    return this.findById(employee.id);
  }

  deleteEmployee(id: number): Observable<number> {
    let employees: Employee[] = JSON.parse(
      this.storage.getItem(StorageProps.EMPLOYEES)!
    );
    let i = employees.findIndex((e) => e.id === id);
    employees.splice(i, 1);
    this.storage.setItem(StorageProps.EMPLOYEES, JSON.stringify(employees));
    return of(i);
  }

  get storage() {
    return sessionStorage;
  }
}
