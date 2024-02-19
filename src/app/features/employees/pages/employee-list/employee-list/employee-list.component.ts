import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Employee } from 'src/app/core/models/Employee.model';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees?: Employee[];
  showModal: boolean = false;
  destroy$: Subject<boolean> = new Subject();

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  loadEmployees() {
    this.employeeService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((employees) => {
        this.employees = employees;
      });
  }

  update(employee: Employee) {
    this.router.navigate([`employee/form/${employee.id}`]);
  }

  view(employee: Employee) {
    this.showModal = true;
  }

  remove(employee: Employee) {
    let i = this.employees?.findIndex((e) => e.id === employee.id);
    this.employeeService.deleteEmployee(employee.id).subscribe((i) => {
      this.employees?.splice(i, 1);
    });
  }
}
