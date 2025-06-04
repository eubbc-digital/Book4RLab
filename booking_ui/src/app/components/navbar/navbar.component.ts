/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { BreakpointObserver, Breakpoints, BreakpointState,} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import config from '../../config.json';

import { UserService } from 'src/app/services/user.service';

import { Group } from 'src/app/enums/group';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isHandset: Observable<BreakpointState> = this.breakPointObserver.observe(
    Breakpoints.Handset
  );

  professorLearnifyUrl = config.learnifyUrl.instructor;
  studentLearnifyUrl = config.learnifyUrl.student;
  isLearnifyUrl = false;
  isLoggedIn = false;
  isProfessor = false;

  constructor(
    private router: Router,
    private breakPointObserver: BreakpointObserver,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.userService.getUserData().subscribe(
        (user) => {
          this.isProfessor = user.groups?.some(group => group.name === Group.Professors) ?? false;

          this.isLearnifyUrl = this.isProfessor
            ? this.professorLearnifyUrl !== ''
            : this.studentLearnifyUrl !== '';

          this.isLoggedIn = true;
        },
        (err) => (this.isLoggedIn = false)
      );

      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.isProfessor = false;
    }
  }

  goToInstructorAccess(): void {
    this.router.navigateByUrl('/instructor-access');
  }

  goToLabManager(): void {
    this.router.navigateByUrl('/my-labs');
  }
  goToLabGrid(): void {
    this.router.navigateByUrl('/labs');
  }

  goToMyReservations(): void {
    this.router.navigateByUrl('/my-reservations');
  }

  goToPublicReservations(): void {
    this.router.navigateByUrl('/public-reservations');
  }

  goToMyProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  goToLogin(): void {
    this.router.navigateByUrl('/access');
  }

  goToLearnifyProfessor(): void {
    window.open(
      this.professorLearnifyUrl,
      '_blank'
    );
  }

  goToLearnifyStudent(): void {
    window.open(this.studentLearnifyUrl, '_blank');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.goToLabGrid();
    this.isLoggedIn = false;
    this.isProfessor = false;
  }
}
