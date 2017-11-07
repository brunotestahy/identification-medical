import { Component, OnInit } from '@angular/core';
import { Practitioner } from 'front-end-common';

@Component({
  selector: 'app-app-content',
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.css']
})
export class AppContentComponent implements OnInit {

  name: string;

  constructor() { }

  ngOnInit() {
    const strEmployee = sessionStorage.getItem('employee');
    if (strEmployee != null && strEmployee.trim().length !== 0) {
      const employee: Practitioner = JSON.parse(strEmployee).dto;
      this.name = employee.fullName;
    }
  }

}
