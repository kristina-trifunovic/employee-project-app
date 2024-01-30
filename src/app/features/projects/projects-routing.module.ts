import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ProjectFormComponent } from './pages/project-form/project-form.component';

const routes: Routes = [
  { path: 'list', component: ProjectListComponent },
  {
    path: 'form/:id',
    component: ProjectFormComponent,
    data: { mode: 'UPDATE' },
    resolve: {},
  },
  { path: 'form', component: ProjectFormComponent, data: { mode: 'ADD' } },
  { path: '', pathMatch: 'full', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
