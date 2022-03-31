import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-private-reservations',
  templateUrl: './private-reservations.component.html',
  styleUrls: ['./private-reservations.component.css'],
})
export class PrivateReservationsComponent implements OnInit {
  reservationList: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getPersonalBookingList();
  }

  getPersonalBookingList(): void {
    this.bookingService.getPersonalBookingList().subscribe((bookingList) => {
      this.reservationList = bookingList;
      console.log(this.reservationList);
    });
  }
}
