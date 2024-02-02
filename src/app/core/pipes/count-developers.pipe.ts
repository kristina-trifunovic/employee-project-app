import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDescription } from '../models/Project.model';
import { ProjectRole } from '../enums/enums';

@Pipe({
  name: 'countDevelopers',
})
export class CountDevelopersPipe implements PipeTransform {
  transform(engagedEmployees: ProjectDescription[] | undefined): number {
    return engagedEmployees!.filter(
      (projDesc) => projDesc.role === ProjectRole.DEVELOPER
    ).length;
  }
}
