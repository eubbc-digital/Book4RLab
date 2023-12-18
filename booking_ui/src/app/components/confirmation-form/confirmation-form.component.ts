/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Equipment } from 'src/app/interfaces/equipment';
import { Lab } from 'src/app/interfaces/lab';
import { Booking } from 'src/app/interfaces/booking';
import { BookingService } from 'src/app/services/booking.service';
import * as moment from 'moment';

@Component({
  selector: 'app-confirmation-form',
  templateUrl: './confirmation-form.component.html',
  styleUrls: ['./confirmation-form.component.css'],
})
export class ConfirmationFormComponent implements OnInit {
  @Input() bookingId!: number;
  @Input() selectedEquipment: Equipment = { id: 0, name: '' };
  @Input() selectedLab: Lab = { id: 0, name: '' };

  @Output() reservationTypeEvent = new EventEmitter<boolean>();

  publicReservation: boolean = false;

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

  updateReservationType(): void {
    this.reservationTypeEvent.emit(this.publicReservation);
  }
}
