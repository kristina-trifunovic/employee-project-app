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
  filteredProjects?: Project[];
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
    this.filterProjects();
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
        this.filteredProjects = [...this.projects];
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

  filterProjects() {
    this.projectForm?.valueChanges.subscribe(() => {
      this.filter();
    });
  }

  filter() {
    const filterData = {
      name: this.projectForm?.get('name')?.value,
      budgetFrom: this.projectForm?.get('budgetFrom')?.value,
      budgetTo: this.projectForm?.get('budgetTo')?.value,
      employee: this.projectForm?.get('employee')?.value,
    };
    if (this.isFilterEmpty(filterData))
      this.filteredProjects = [...this.projects!];
    else this.filterList(filterData);
  }

  compareEmployee(first?: Employee, second?: Employee): boolean {
    return first?.id === second?.id;
  }

  isFilterEmpty(filterData: {
    name: string;
    employee: Employee;
    budgetFrom: number;
    budgetTo: number;
  }) {
    return (
      filterData.name === '' &&
      (filterData.employee == null || filterData.employee == undefined) &&
      isNaN(filterData.budgetFrom) &&
      isNaN(filterData.budgetTo)
    );
  }

  filterList(filterData: {
    name: string;
    employee: Employee;
    budgetFrom: number;
    budgetTo: number;
  }) {
    this.filteredProjects = this.projects?.filter(
      (project) =>
        project.name.toLowerCase().includes(filterData.name.toLowerCase()) &&
        project.budget >= filterData.budgetFrom &&
        (project.budget <= filterData.budgetTo ||
          filterData.budgetTo.toString() == '') &&
        (project.engagedEmployees.findIndex(
          (pd) =>
            pd.employee.id ===
            (filterData.employee != undefined ? filterData.employee['id'] : -1)
        ) != -1 ||
          filterData.employee == null)
    );
  }
}
