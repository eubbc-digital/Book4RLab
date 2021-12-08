import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-link',
  templateUrl: './booking-link.component.html',
  styleUrls: ['./booking-link.component.css'],
})
export class BookingLinkComponent implements OnInit {
  @Input() bookingLink!: string;
  constructor() {}

  ngOnInit(): void {}

  isBookingLinkAvailable(): boolean {
    return this.bookingLink !== undefined;
  }
}
