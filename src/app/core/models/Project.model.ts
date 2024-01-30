import { ProjectRole } from '../enums/enums';
import { Employee } from './Employee.model';

export interface Project {
  id: string;
  name: string;
  budget: number;
  startDate: Date;
  engagedEmployees: ProjectDescription;
}

export interface ProjectDescription {
  employee: Employee;
  role: ProjectRole;
  startDate: Date;
  engagementDuration: number;
}
