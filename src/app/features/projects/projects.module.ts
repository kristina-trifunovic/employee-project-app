import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './pages/project-list/project-list.component';
import { ProjectFormComponent } from './pages/project-form/project-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EngagedEmployeesPipe } from 'src/app/core/pipes/engaged-employees.pipe';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [ProjectListComponent, ProjectFormComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
  ],
})
export class ProjectsModule {}
