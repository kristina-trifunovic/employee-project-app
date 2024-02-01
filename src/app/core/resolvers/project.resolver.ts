import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/Project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectResolver implements Resolve<Project | undefined> {
  constructor(private projectService: ProjectService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Project | undefined> {
    const id = route.paramMap.get('id')!;
    return this.projectService.findById(id);
  }
}
