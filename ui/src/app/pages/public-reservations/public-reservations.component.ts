/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

import { BookingService } from 'src/app/services/booking.service';
import { KitService } from 'src/app/services/kit.service';
import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';

import { Booking } from 'src/app/interfaces/booking';
import { Kit } from 'src/app/interfaces/kit';
import { Lab } from 'src/app/interfaces/lab';
import * as moment from 'moment';

@Component({
  selector: 'app-public-reservations',
  templateUrl: './public-reservations.component.html',
  styleUrls: ['./public-reservations.component.css'],
})
export class PublicReservationsComponent implements OnInit {
  searcherControlGroup = new UntypedFormGroup({
    selectedLab: new UntypedFormControl('', [Validators.required]),
    selectedKit: new UntypedFormControl('', [Validators.required]),
    startDate: new UntypedFormControl('', [Validators.required]),
    endDate: new UntypedFormControl('', [Validators.required]),
  });

  reservationList: Booking[] = [];
  labs: Lab[] = [];
  kits: Kit[] = [];

  kitsId: number[] = [];

  optionAll: Kit = { id: 0, name: 'All' };

  showMessage: boolean = false;
  showSpinner: boolean = false;

  constructor(
    private labService: LabService,
    private kitService: KitService,
    private bookingService: BookingService,
    private toastService: ToastrService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.getLaboratories();
  }

  get labControl() {
    return this.searcherControlGroup.controls['selectedLab'];
  }

  get kitControl() {
    return this.searcherControlGroup.controls['selectedKit'];
  }

  get startDateControl() {
    return this.searcherControlGroup.controls['startDate'];
  }

  get endDateControl() {
    return this.searcherControlGroup.controls['endDate'];
  }

  getLaboratories(): void {
    this.labService.getVisibleLabs().subscribe((labs) => {
      this.labs = labs;
      if (this.labs.length > 0) this.selectFirstAvailableLab();
    });
  }

  selectFirstAvailableLab(): void {
    const selectedLab = this.labs[0];

    this.labControl.setValue(selectedLab);

    this.getKitsByLabId(selectedLab.id!);
  }

  getKitsByLabId(labId: number) {
    this.kitService.getKitsByLabId(labId).subscribe((kits) => {
      this.kits = kits.reverse();

      this.kitsId = this.kits.map((kit) => {
        return kit.id!;
      });

      this.kits.unshift(this.optionAll);

      if (this.kits.length > 0) this.setDataFromFirstAvailableKit();
    });
  }

  setDataFromFirstAvailableKit(): void {
    const selectedKit = this.kits[0];
    this.searcherControlGroup.controls['selectedKit'].setValue(selectedKit);
  }

  getPublicBookingList(): void {
    if (this.searcherControlGroup.valid) {
      this.showMessage = false;
      this.showSpinner = true;

      let kitId = this.kitControl.value.id;
      let startDate = moment(this.startDateControl.value).utc().format();
      let endDate = moment(this.endDateControl.value).utc().format();

      this.bookingService
        .getPublicReservations(kitId, startDate, endDate)
        .subscribe((reservations) => {
          this.reservationList = reservations.filter((reservation) =>
            this.kitListIncludesId(reservation.kit!)
          );

          this.showSpinner = false;

          if (this.reservationList.length == 0) {
            this.showMessage = true;
          }
        });
    } else {
      this.toastService.error('Please fill in the data correctly.');
    }
  }

  kitListIncludesId(kitId: number): boolean {
    return this.kitsId.includes(kitId);
  }

  isStartDateInvalid(): boolean {
    return (
      this.startDateControl.hasError('matStartDateInvalid') ||
      this.startDateControl.hasError('matDatepickerParse')
    );
  }

  isEndDateInvalid(): boolean {
    return (
      this.endDateControl.hasError('matStartDateInvalid') ||
      this.endDateControl.hasError('matDatepickerParse')
    );
  }

  isDateRangeIncomplete(): boolean {
    return (
      this.startDateControl.errors !== null &&
      this.startDateControl.errors['required'] &&
      this.endDateControl.errors !== null &&
      this.endDateControl.errors['required']
    );
  }
}
