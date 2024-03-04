import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../models/Project.model';
import { StorageProps } from '../enums/enums';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<Project[]> {
    const projects = JSON.parse(this.storage.getItem(StorageProps.PROJECTS)!);
    return projects
      ? of(projects)
      : this.httpClient.get<Project[]>(
          `${environment.serverUrl}/projects.json`
        );
  }

  findById(id: string): Observable<Project | undefined> {
    return this.findAll().pipe(
      map((projects) => projects.find((project) => project.id === id))
    );
  }

  addProject(project: Project): Observable<Project | undefined> {
    let projects = JSON.parse(this.storage.getItem(StorageProps.PROJECTS)!);
    project.id = uuid();
    projects.push(project);
    this.storage.setItem(StorageProps.PROJECTS, JSON.stringify(projects));
    return this.findById(project.id);
  }

  updateProject(project: Project) {
    // project.id = uuid();
    let projects: Project[] = JSON.parse(
      this.storage.getItem(StorageProps.PROJECTS)!
    );
    let index = projects.findIndex((e) => e.id === project.id);
    projects.splice(index, 1, project);
    this.storage.setItem(StorageProps.PROJECTS, JSON.stringify(projects));
    return this.findById(project.id);
  }

  deleteProject(id: string): Observable<number> {
    let projects: Project[] = JSON.parse(
      this.storage.getItem(StorageProps.PROJECTS)!
    );
    let i = projects.findIndex((p) => p.id === id);
    projects.splice(i, 1);
    this.storage.setItem(StorageProps.PROJECTS, JSON.stringify(projects));
    return of(i);
  }

  get storage() {
    return sessionStorage;
  }
}
