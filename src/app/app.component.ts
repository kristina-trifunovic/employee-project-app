import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from './core/services/project.service';
import { Project } from './core/models/Project.model';
import { EmployeeService } from './core/services/employee.service';
import { Employee } from './core/models/Employee.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'employee-project-app';
  projects?: Project[];
  employees?: Employee[];
  destroy$: Subject<boolean> = new Subject();

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  goToEmployees() {
    this.router.navigate(['employee']);
  }

  goToProjects() {
    this.router.navigate(['project']);
  }

  homepage() {
    this.router.navigate(['/']);
  }

  loadInitialData() {
    this.projectService.findAll().subscribe((projects) => {
      this.projects = projects;
      if (this.projectService.storage.getItem('projects') == null)
        this.projectService.storage.setItem(
          'projects',
          JSON.stringify(projects)
        );
    });

    this.employeeService.findAll().subscribe((employees) => {
      this.employees = employees;
      if (this.projectService.storage.getItem('employees') == null)
        this.projectService.storage.setItem(
          'employees',
          JSON.stringify(employees)
        );
    });
  }
}
