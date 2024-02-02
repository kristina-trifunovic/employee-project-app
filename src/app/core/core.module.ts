import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngagedEmployeesPipe } from './pipes/engaged-employees.pipe';
import { CountDevelopersPipe } from './pipes/count-developers.pipe';
import { CountAnalystsPipe } from './pipes/count-analysts.pipe';

@NgModule({
  declarations: [EngagedEmployeesPipe, CountDevelopersPipe, CountAnalystsPipe],
  imports: [CommonModule],
  exports: [EngagedEmployeesPipe, CountDevelopersPipe, CountAnalystsPipe],
})
export class CoreModule {}
