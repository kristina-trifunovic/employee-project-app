import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProjectRole } from 'src/app/core/enums/enums';
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
  showModal: boolean = false;
  showProject?: Project;
  rolesToDisplay = [ProjectRole.PROJECT_MANAGER, ProjectRole.TEAM_LEAD];

  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
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
      budgetFrom: [null, [Validators.min(0)]],
      budgetTo: [null, [Validators.min(0), this.validateBudgetTo.bind(this)]],
      employee: [null],
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
    this.projectForm?.valueChanges
      .pipe(distinctUntilChanged())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
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
      const nameCheck = project.name
        .toLowerCase()
        .includes(this.filterData!.name.toLowerCase());
      const budgetFromCheck =
        project.budget >= this.filterData!.budgetFrom ||
        this.filterData!.budgetFrom === null;
      const budgetToCheck =
        project.budget <= this.filterData!.budgetTo ||
        this.filterData!.budgetTo === null;
      const employeeCheck =
        this.filterData!.employee === null ||
        project.engagedEmployees.findIndex(
          (projDesc) => projDesc.employee.id === this.filterData?.employee['id']
        ) != -1;
      return nameCheck && budgetFromCheck && budgetToCheck && employeeCheck;
    });
  }

  update(project: Project) {
    this.router.navigate([`project/form/${project.id}`]);
  }

  view(project: Project) {
    this.showModal = true;
    this.showProject = project;
  }

  remove(project: Project) {
    let i = this.projects?.findIndex((p) => p.id === project.id);
    this.projectService.deleteProject(project.id).subscribe((i) => {
      this.projects?.splice(i, 1);
    });
  }

  closeModal() {
    this.showModal = false;
  }
}
