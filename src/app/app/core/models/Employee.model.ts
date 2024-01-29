import { Seniority } from '../enums/enums';

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  seniority: Seniority;
}
