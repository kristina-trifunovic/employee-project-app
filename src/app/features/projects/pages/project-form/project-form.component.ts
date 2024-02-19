import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Mode, ProjectRole, Seniority } from 'src/app/core/enums/enums';
import { Employee } from 'src/app/core/models/Employee.model';
import { Project, ProjectDescription } from 'src/app/core/models/Project.model';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  [x: string]: any;
  projectForm?: FormGroup;
  project?: Project;
  mode = '';
  employees?: Employee[];
  destroy$: Subject<boolean> = new Subject();
  roles = Object.values(ProjectRole);
  filteredRoles = [...this.roles];
  filteredEmployees: Employee[] = [];

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnInit(): void {
    this.mode = this.activeRoute.snapshot.data['mode'];
    this.project = this.activeRoute.snapshot.data['project'];
    this.buildForm(this.project);
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
        this.filteredEmployees = employees;
      });
  }

  buildForm(project?: Project): void {
    this.projectForm = this.fb.group({
      id: [project?.id], // TODO add a auto generated ID
      name: [
        project?.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      budget: [project?.budget, [Validators.required, Validators.min(1)]],
      startDate: [project?.startDate],
    });
    this.projectForm.setControl('engagedEmployees', this.fb.array([]));
    if (project === undefined) this.addEngagedEmployee();
    project?.engagedEmployees.forEach((projDesc) =>
      this.addEngagedEmployee(projDesc)
    );
  }

  addEngagedEmployee(projDesc?: ProjectDescription) {
    this.engagedEmployees.push(this.createEngagedEmployeeFormGroup(projDesc));
  }

  removeEngagedEmployee(index: number) {
    const size = this.engagedEmployees.length;
    if (size === 1) return;
    else this.engagedEmployees.removeAt(index);
  }

  createEngagedEmployeeFormGroup(projDesc?: ProjectDescription): FormGroup {
    return this.fb.group({
      employee: [projDesc?.employee, Validators.required],
      role: [projDesc?.role, Validators.required],
      startDate: [
        projDesc?.startDate,
        [Validators.required, this.validateStartDate.bind(this)],
      ],
      engagementDuration: [
        projDesc?.engagementDuration,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  onSubmit() {
    const project = this.projectForm?.value;
    console.log(project);
    this.addOrUpdateProject(project).subscribe((project) => {
      console.log(`${this.mode} mode project: `, project);
      this.router.navigate(['project']);
    });
  }

  addOrUpdateProject(project: Project) {
    return this.mode === Mode.ADD
      ? this.projectService.addProject(project)
      : this.projectService.updateProject(project);
  }

  validateStartDate(formControl: FormControl) {
    const startProjectDate = this.projectForm?.get('startDate')?.value;
    const startEmploymentDate = formControl.value;

    if (
      startProjectDate !== null &&
      startEmploymentDate !== null &&
      startProjectDate > startEmploymentDate
    ) {
      return { invalidStartDate: true };
    }
    return null;
  }

  filterRoles(employee: Employee) {
    if (employee.seniority === Seniority.SENIOR)
      this.filteredRoles = [...this.roles];
    else
      this.filteredRoles = this.roles.filter(
        (role) =>
          role === ProjectRole.BUSINESS_ANALYST ||
          role === ProjectRole.DEVELOPER
      );
  }

  filterEmployees(role: ProjectRole) {
    if (role === ProjectRole.PROJECT_MANAGER || role === ProjectRole.TEAM_LEAD)
      this.filteredEmployees = this.employees!.filter(
        (employee) => employee.seniority === Seniority.SENIOR
      );
    else this.filteredEmployees = [...this.employees!];
  }

  compareEmployee(first?: Employee, second?: Employee): boolean {
    return first?.id === second?.id;
  }

  get engagedEmployees(): FormArray {
    return this.projectForm?.get('engagedEmployees') as FormArray;
  }
}
