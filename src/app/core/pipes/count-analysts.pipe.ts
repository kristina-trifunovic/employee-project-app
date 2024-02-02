import { Pipe, PipeTransform } from '@angular/core';
import { ProjectRole } from '../enums/enums';
import { ProjectDescription } from '../models/Project.model';

@Pipe({
  name: 'countAnalysts',
})
export class CountAnalystsPipe implements PipeTransform {
  transform(engagedEmployees: ProjectDescription[] | undefined): number {
    return engagedEmployees!.filter(
      (projDesc) => projDesc.role === ProjectRole.BUSINESS_ANALYST
    ).length;
  }
}
