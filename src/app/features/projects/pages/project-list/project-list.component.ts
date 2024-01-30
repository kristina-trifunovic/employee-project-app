import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Employee } from 'src/app/core/models/Employee.model';
import { Project } from 'src/app/core/models/Project.model';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects?: Project[];
  employees?: Employee[];
  destroy$: Subject<boolean> = new Subject();
  projectForm?: FormGroup;
  mode = '';

  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.buildFilterForm();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  loadProjects() {
    this.projectService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => {
        this.projects = projects;
      });
  }

  loadEmployees() {
    this.employeeService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((employees) => {
        this.employees = employees;
      });
  }

  buildFilterForm() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      budgetFrom: ['', [Validators.min(0)]],
      budgetTo: ['', [Validators.min(0), this.validateBudgetTo.bind(this)]],
      employees: [''],
    });
  }

  validateBudgetTo(formControl: FormControl) {
    console.log(formControl);

    const budgetFromValue = this.projectForm?.get('budgetFrom')?.value;
    const budgetToValue = formControl.value;

    if (
      budgetFromValue !== null &&
      budgetToValue !== null &&
      budgetToValue < budgetFromValue
    ) {
      return { invalidBudgetTo: true };
    }
    return null;
  }

  compareEmployee(first?: Employee, second?: Employee): boolean {
    return first?.id === second?.id;
  }
}
