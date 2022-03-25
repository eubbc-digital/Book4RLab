import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Kit } from 'src/app/interfaces/kit';
import { Lab } from 'src/app/interfaces/lab';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/services/booking.service';
import * as moment from 'moment';
import { KitService } from 'src/app/services/kit.service';
import { LabService } from 'src/app/services/lab.service';

@Component({
  selector: 'app-confirmation-form',
  templateUrl: './confirmation-form.component.html',
  styleUrls: ['./confirmation-form.component.css'],
})
export class ConfirmationFormComponent implements OnInit {
  @Input() bookingId: number = 0;
  @Input() selectedKit: Kit = { id: 0, name: '' };
  @Input() selectedLab: Lab = { name: '' };

  currentUser: User = { email: '', name: '', last_name: '' };
  booking: Booking | undefined;

  constructor(
    private userService: UserService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  ngOnChanges() {
    this.getBookingById();
  }

  getUserData(): void {
    this.userService
      .getUserData()
      .subscribe((user) => (this.currentUser = user));
  }

  getBookingById() {
    if (this.bookingId !== 0) {
      this.bookingService
        .getBookingById(this.bookingId)
        .subscribe((booking) => {
          this.booking = booking;
        });
    }
  }

  getFormattedDate(): string {
    if (this.booking) {
      return moment(this.booking?.start_date).format('MMMM Do YYYY, h:mm a');
    }
    return '';
  }
}
