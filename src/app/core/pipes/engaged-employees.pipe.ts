import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDescription } from '../models/Project.model';
import { ProjectRole } from '../enums/enums';

@Pipe({
  name: 'engagedEmployees',
})
export class EngagedEmployeesPipe implements PipeTransform {
  transform(
    engagedEmployees: ProjectDescription[] | undefined,
    roles: ProjectRole[]
  ): ProjectDescription[] | undefined {
    return engagedEmployees?.filter((projDesc) =>
      roles.includes(projDesc.role)
    );
  }
}
