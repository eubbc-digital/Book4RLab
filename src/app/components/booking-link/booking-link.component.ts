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

  areBookingLinksAvailable(): boolean {
    return (
      this.privateBookingLink !== undefined &&
      this.publicBookingLink !== undefined
    );
  }
}
