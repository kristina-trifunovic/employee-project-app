import { Injectable } from '@angular/core';
import { Employee } from '../models/Employee.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<Employee[]> {
    console.log(`${environment.serverUrl}/employees.json`);
    return this.httpClient.get<Employee[]>(
      `${environment.serverUrl}/employees.json`
    );
  }
}
