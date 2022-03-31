import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Booking } from 'src/app/interfaces/booking';
import { Kit } from 'src/app/interfaces/kit';
import { Lab } from 'src/app/interfaces/lab';
import { BookingService } from 'src/app/services/booking.service';
import { KitService } from 'src/app/services/kit.service';
import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-public-reservations',
  templateUrl: './public-reservations.component.html',
  styleUrls: ['./public-reservations.component.css'],
})
export class PublicReservationsComponent implements OnInit {
  searcherControlGroup = new FormGroup({
    selectedLab: new FormControl('', [Validators.required]),
    selectedKit: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });

  reservationList: Booking[] = [];
  labs: Lab[] = [];
  kits: Kit[] = [];

  showMessage: boolean = false;
  showSpinner: boolean = false;

  constructor(
    private labService: LabService,
    private kitService: KitService,
    private bookingService: BookingService,
    private toastService: ToastrService
  ) {}

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
    this.labService.getLabs().subscribe((labs) => {
      this.labs = labs;
      this.selectFirstAvailableLab();
    });
  }

  selectFirstAvailableLab(): void {
    if (this.labs.length > 0) {
      const selectedLab = this.labs[0];

      this.labControl.setValue(selectedLab);

      this.getKitsByLabId(selectedLab.id!);
    }
  }

  getKitsByLabId(labId: number) {
    this.kitService.getKitsByLabId(labId).subscribe((kits) => {
      this.kits = kits.reverse();

      this.setDataFromFirstAvailableKit();
    });
  }

  setDataFromFirstAvailableKit(): void {
    if (this.kits.length > 0) {
      const selectedKit = this.kits[0];
      this.searcherControlGroup.controls['selectedKit'].setValue(selectedKit);
    }
  }

  getPublicBookingList(): void {
    if (this.searcherControlGroup.valid) {
      this.showMessage = false;
      this.showSpinner = true;

      let kitId = this.kitControl.value.id;
      let startDate = moment().utc(this.startDateControl.value).format();
      let endDate = moment().utc(this.endDateControl.value).format();

      this.bookingService
        .getPublicReservations(kitId, startDate, endDate)
        .subscribe((reservations) => {
          this.reservationList = reservations;

          this.showSpinner = false;

          if (this.reservationList.length == 0) {
            this.showMessage = true;
          }

          console.log(this.reservationList);
        });
    } else {
      this.toastService.error('Please fill in the data correctly.');
    }
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
