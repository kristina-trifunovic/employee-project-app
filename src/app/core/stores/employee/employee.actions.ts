import { createAction, props } from '@ngrx/store';
import { Employee } from '../../models/Employee.model';

export const findAll = createAction('[Employee Component] Find All');
export const add = createAction(
  '[Employee Component] Addition',
  props<{ newData: Employee }>()
);
export const update = createAction(
  '[Employee Component] Update',
  props<{ newData: Employee }>()
);
export const findById = createAction(
  '[Employee Component] Find By ID',
  props<{ id: number }>()
);
