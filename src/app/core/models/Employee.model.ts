import { Seniority } from '../enums/enums';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  seniority: Seniority;
}
