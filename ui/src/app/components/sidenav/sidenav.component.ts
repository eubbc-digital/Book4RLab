﻿/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Output() closeSidebarEvent = new EventEmitter<any>();

  title = 'Remote Lab Booking';

  showDashboard: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.showDashboard = localStorage.getItem('user') !== 'operario';
  }

  closeSidebar(): void {
    this.closeSidebarEvent.emit();
  }
}
