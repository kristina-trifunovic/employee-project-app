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
  filterData?: {
    name: string;
    budgetFrom: number;
    budgetTo: number;
    employee: Employee;
  };

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
      employee: [''],
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
    this.filterData = {
      name: this.projectForm?.get('name')?.value,
      budgetFrom: this.projectForm?.get('budgetFrom')?.value,
      budgetTo: this.projectForm?.get('budgetTo')?.value,
      employee: this.projectForm?.get('employee')?.value,
    };
    if (this.isFilterEmpty()) this.filteredProjects = [...this.projects!];
    else this.filterList();
  }

  compareEmployee(first?: Employee, second?: Employee): boolean {
    return first?.id === second?.id;
  }

  isFilterEmpty() {
    return (
      this.filterData?.name === '' &&
      (this.filterData.employee == null ||
        this.filterData.employee == undefined) &&
      this.filterData.budgetFrom.toString() === '' &&
      this.filterData.budgetTo.toString() === ''
    );
  }

  filterList() {
    this.filteredProjects = this.projects?.filter((project) => {
      const nameCheck =
        project.name
          .toLowerCase()
          .includes(this.filterData!.name.toLowerCase()) &&
        this.filterData!.name != '';
      const budgetFromCheck =
        project.budget >= this.filterData!.budgetFrom &&
        this.filterData!.budgetFrom.toString() != '';
      const budgetToCheck =
        project.budget <= this.filterData!.budgetTo &&
        this.filterData!.budgetTo.toString() != '';
      const employeeCheck =
        project.engagedEmployees.findIndex(
          (projDesc) => projDesc.employee.id === this.filterData?.employee['id']
        ) != -1;
      return nameCheck || budgetFromCheck || budgetToCheck || employeeCheck;
    });
  }
}
