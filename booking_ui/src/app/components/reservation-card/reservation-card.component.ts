/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Booking } from 'src/app/interfaces/booking';
import { Equipment } from 'src/app/interfaces/equipment';
import { Lab } from 'src/app/interfaces/lab';
import { EquipmentService } from 'src/app/services/equipment.service';
import { LabService } from 'src/app/services/lab.service';
import { BookingService } from 'src/app/services/booking.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import config from '../../config.json';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.css'],
})
export class ReservationCardComponent implements OnInit {
  @Input() reservation!: Booking;
  @Input() privateList: boolean = false;

  @Output() cancelReservationEvent = new EventEmitter<boolean>();

  equipment!: Equipment;
  lab!: Lab;

  dataReady: boolean = false;

  dateTimeFormat: string = 'MMMM Do YYYY, h:mm:ss a';

  cancelReservationMessage: string =
    'Are you sure you want to cancel your reservation?';

  constructor(
    private equipmentService: EquipmentService,
    private labService: LabService,
    private bookingService: BookingService,
    public dialog: MatDialog,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.reservation !== null) this.getEquipment();
  }

  getPrivateAccessUrl(): string {
    return `${this.lab.url}?${config.urlParams.accessKey}=${this.reservation.access_key}&${config.urlParams.password}=${this.reservation.password}`;
  }

  getPublicAccessUrl(): string {
    return `${this.lab.url}?${config.urlParams.accessKey}=${this.reservation.access_key}`;
  }

  getEquipment(): void {
    this.equipmentService.getEquipmentById(this.reservation.equipment!).subscribe((equipment) => {
      this.equipment = equipment;
      this.getLab(this.equipment.laboratory!);
    });
  }

  getLab(labId: number): void {
    this.labService.getLabById(labId).subscribe((lab) => {
      this.lab = lab;
      this.dataReady = true;
    });
  }

  getReservationType(): string {
    return this.reservation.public ? 'Public' : 'Private';
  }

  getReservedBy(): string {
    return this.reservation.reserved_by !== null
      ? `${this.reservation.reserved_by!.name} ${
          this.reservation.reserved_by!.last_name
        }`
      : 'Information not available.';
  }

  getFormattedDate(date: string): string {
    return moment(date).format(this.dateTimeFormat);
  }

  showCancelButton(): boolean {
    return (
      this.privateList && moment(this.reservation.start_date).isAfter(moment())
    );
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: this.cancelReservationMessage },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result.answer) this.cancelReservation();
    });
  }

  cancelReservation(): void {
    this.reservation.reserved_by = null;
    this.reservation.available = true;
    this.reservation.public = false;

    this.bookingService
      .cancelBooking(this.reservation)
      .subscribe((response) => {
        if (response) {
          this.getReservations();
          this.toastService.success(
            'Your reservation was successfully deleted.'
          );
        } else {
          this.toastService.error(
            'There was a problem please try again later.'
          );
        }
      });
  }

  getReservations(): void {
    this.cancelReservationEvent.emit();
  }
}

