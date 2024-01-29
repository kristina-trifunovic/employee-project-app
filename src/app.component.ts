import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './app/core/services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'employee-project-app';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.findAll().subscribe((e) => console.log(e));
  }
}
