import { createReducer, on } from '@ngrx/store';
import { add, findAll, findById, update } from './employee.actions';
import { Employee } from '../../models/Employee.model';

export const initialState: Employee[] = [];

export const employeeReducer = createReducer(
  initialState,
  // on(findAll, () => {
  //   return sessionStorage.getItem('employees');
  // }),
  on(add, (state, employee) => {
    let employees = JSON.parse(sessionStorage.getItem('employees')!);
    employees.push(employee);
    sessionStorage.setItem('employees', JSON.stringify(employees));
    return employees;
  }),
  // on(update, (state, employee) => {
  //   let index =
  // }),
  on(findById, (state) => state)
);
