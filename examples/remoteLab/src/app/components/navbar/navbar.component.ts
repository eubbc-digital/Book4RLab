import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import data from '../../../config.json';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  appName: string = '';

  constructor(private router: Router) {
    this.appName = data.appInformation.name;
  }

  ngOnInit(): void {}

  logout(): void {
    localStorage.removeItem('token');
    this.goToLogin();
  }

  goToLogin(): void {
    this.router.navigateByUrl('/access');
  }
}
