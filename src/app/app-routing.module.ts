import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'employee',
    loadChildren: () =>
      import('./features/employees/employees.module').then(
        (e) => e.EmployeesModule
      ),
  },
  {
    path: 'project',
    loadChildren: () =>
      import('./features/projects/projects.module').then(
        (e) => e.ProjectsModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
