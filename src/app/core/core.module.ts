import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngagedEmployeesPipe } from './pipes/engaged-employees.pipe';
import { CountDevelopersPipe } from './pipes/count-developers.pipe';
import { CountAnalystsPipe } from './pipes/count-analysts.pipe';
import { UpdateProjectDirective } from './directives/update-project.directive';

@NgModule({
  declarations: [
    EngagedEmployeesPipe,
    CountDevelopersPipe,
    CountAnalystsPipe,
    UpdateProjectDirective,
  ],
  imports: [CommonModule],
  exports: [
    EngagedEmployeesPipe,
    CountDevelopersPipe,
    CountAnalystsPipe,
    UpdateProjectDirective,
  ],
})
export class CoreModule {}
