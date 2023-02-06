/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './services/user.service';

import { Group } from './enums/group';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'remote-lab-booking';

  showSidenav = false;

  constructor(public router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserData().subscribe((user) => {
      user.groups!.forEach((group) => {
        if (group.name === Group.Professors) this.showSidenav = true;
      });
    });
  }
}
