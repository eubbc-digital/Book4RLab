import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css'],
})
export class ReservationListComponent implements OnInit {
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
