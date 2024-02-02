import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../models/Project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(
      `${environment.serverUrl}/projects.json`
    );
  }

  findById(id: string): Observable<Project | undefined> {
    return this.findAll().pipe(
      map((projects) => projects.find((project) => project.id === id))
    );
  }

  addProject(project: Project): Observable<Project | undefined> {
    let projects = JSON.parse(this.storage.getItem('projects')!);
    projects.push(project);
    this.storage.setItem('projects', JSON.stringify(projects));
    return this.findById(project.id);
  }

  updateProject(project: Project) {
    let projects: Project[] = JSON.parse(this.storage.getItem('projects')!);
    let index = projects.findIndex((e) => e.id === project.id);
    projects.splice(index, 1, project);
    this.storage.setItem('projects', JSON.stringify(projects));
    return this.findById(project.id);
  }

  deleteProject(id: string): Observable<number> {
    let projects: Project[] = JSON.parse(this.storage.getItem('projects')!);
    let i = projects.findIndex((p) => p.id === id);
    projects.splice(i, 1);
    this.storage.setItem('projects', JSON.stringify(projects));
    return of(i);
  }

  get storage() {
    return sessionStorage;
  }
}
