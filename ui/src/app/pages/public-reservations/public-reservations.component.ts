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
import { EquipmentService } from 'src/app/services/equipment.service';
import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';

import { Booking } from 'src/app/interfaces/booking';
import { Equipment } from 'src/app/interfaces/equipment';
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
    selectedEquipment: new UntypedFormControl('', [Validators.required]),
    startDate: new UntypedFormControl('', [Validators.required]),
    endDate: new UntypedFormControl('', [Validators.required]),
  });

  reservationList: Booking[] = [];
  labs: Lab[] = [];
  equipments: Equipment[] = [];

  equipmentsId: number[] = [];

  optionAll: Equipment = { id: 0, name: 'All' };

  showMessage: boolean = false;
  showSpinner: boolean = false;

  constructor(
    private labService: LabService,
    private equipmentService: EquipmentService,
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

  get equipmentControl() {
    return this.searcherControlGroup.controls['selectedEquipment'];
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

    this.getEquipmentsByLabId(selectedLab.id!);
  }

  getEquipmentsByLabId(labId: number) {
    this.equipmentService.getEquipmentsByLabId(labId).subscribe((equipments) => {
      this.equipments = equipments.reverse();

      this.equipmentsId = this.equipments.map((equipment) => {
        return equipment.id!;
      });

      this.equipments.unshift(this.optionAll);

      if (this.equipments.length > 0) this.setDataFromFirstAvailableEquipment();
    });
  }

  setDataFromFirstAvailableEquipment(): void {
    const selectedEquipment = this.equipments[0];
    this.searcherControlGroup.controls['selectedEquipment'].setValue(selectedEquipment);
  }

  getPublicBookingList(): void {
    if (this.searcherControlGroup.valid) {
      this.showMessage = false;
      this.showSpinner = true;

      let equipmentId = this.equipmentControl.value.id;
      let startDate = moment(this.startDateControl.value).utc().format();
      let endDate = moment(this.endDateControl.value).utc().format();

      this.bookingService
        .getPublicReservations(equipmentId, startDate, endDate)
        .subscribe((reservations) => {
          this.reservationList = reservations.filter((reservation) =>
            this.equipmentListIncludesId(reservation.equipment!)
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

  equipmentListIncludesId(equipmentId: number): boolean {
    return this.equipmentsId.includes(equipmentId);
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
