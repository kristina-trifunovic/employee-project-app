import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/employee-list/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form/employee-form.component';

const routes: Routes = [
  { path: 'list', component: EmployeeListComponent },
  {
    path: 'form/:id',
    component: EmployeeFormComponent,
    data: { mode: 'UPDATE' },
    resolve: {},
  },
  { path: 'form', component: EmployeeFormComponent, data: { mode: 'ADD' } },
  { path: '', pathMatch: 'full', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
