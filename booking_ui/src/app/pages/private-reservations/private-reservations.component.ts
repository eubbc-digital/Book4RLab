/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { Booking } from 'src/app/interfaces/booking';

@Component({
  selector: 'app-private-reservations',
  templateUrl: './private-reservations.component.html',
  styleUrls: ['./private-reservations.component.css'],
})
export class PrivateReservationsComponent implements OnInit {
  showMessage: boolean = false;
  showSpinner: boolean = true;

  reservationList: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getPersonalBookingList();
  }

  getPersonalBookingList(): void {
    this.bookingService.getPersonalBookingList().subscribe((bookingList) => {
      this.showMessage = false;
      this.reservationList = bookingList;
      this.showSpinner = false;

      if (this.reservationList.length == 0) this.showMessage = true;
    });
  }
}
