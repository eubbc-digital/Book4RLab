/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isHandset: Observable<BreakpointState> = this.breakPointObserver.observe(
    Breakpoints.Handset
  );

  constructor(
    private router: Router,
    private breakPointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {}

  goToBooking(): void {
    location.href = '';
  }

  goToMyReservations(): void {
    this.router.navigateByUrl('/my-reservations');
  }

  goToPublicReservations(): void {
    this.router.navigateByUrl('/public-reservations');
  }

  goToLogin(): void {
    this.router.navigateByUrl('/access');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.goToLogin();
  }
}
