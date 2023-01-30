/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-link',
  templateUrl: './booking-link.component.html',
  styleUrls: ['./booking-link.component.css'],
})
export class BookingLinkComponent implements OnInit {
  @Input() startDate: string = '';
  @Input() privateBookingLink!: string;
  @Input() publicBookingLink!: string;

  constructor() {}

  ngOnInit(): void {}

  isBookingLinkAvailable(): boolean {
    return this.privateBookingLink !== undefined;
  }
}
