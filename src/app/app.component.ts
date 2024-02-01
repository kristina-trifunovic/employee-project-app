import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from './core/services/project.service';
import { Project } from './core/models/Project.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'employee-project-app';
  projects?: Project[];

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  goToEmployees() {
    this.router.navigate(['employee']);
  }

  goToProjects() {
    this.router.navigate(['project']);
  }

  homepage() {
    this.router.navigate(['/']);
  }

  loadInitialData() {
    this.projectService.findAll().subscribe((projects) => {
      this.projects = projects;
      if (this.projectService.storage.getItem('projects') == null)
        this.projectService.storage.setItem(
          'projects',
          JSON.stringify(projects)
        );
    });
  }
}
