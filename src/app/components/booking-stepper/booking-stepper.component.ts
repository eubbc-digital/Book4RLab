import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabService } from 'src/app/services/lab.service';
import { KitService } from 'src/app/services/kit.service';
import { Lab } from 'src/app/interfaces/lab';
import { Kit } from 'src/app/interfaces/kit';
import { AvailableDate } from 'src/app/interfaces/available-date';
import { BookingService } from 'src/app/services/booking.service';
import * as moment from 'moment';

@Component({
  selector: 'app-booking-stepper',
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.css'],
})
export class BookingStepperComponent implements OnInit {
  reservationFormGroup!: FormGroup;
  confirmationFormGroup!: FormGroup;

  cols: number;
  bookingId: number = 0;

  startAt = new Date();
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 5));

  dateFormat: string = 'MM/DD/YYYY';
  hourFormat: string = 'hh:mm a';

  stepperOrientation: Observable<StepperOrientation>;

  labs: Lab[] = [];
  kits: Kit[] = [];
  availableHoursBySelectedDate: AvailableDate[] = [];

  isEditable: boolean = true;
  noAvailableData: boolean = false;

  accessUrl!: string;

  timerConfig = {
    leftTime: 420,
    format: 'mm:ss',
  };

  constructor(
    private formBuilder: FormBuilder,
    private labService: LabService,
    private kitService: KitService,
    private bookingService: BookingService,
    breakpointObserver: BreakpointObserver
  ) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.setFormValidation();

    this.labService.getLabs().subscribe((labs) => {
      this.labs = labs;
      this.selectFirstAvailableLab();
    });
  }

  handleSize(event: any) {
    this.cols = event.target.innerWidth <= 900 ? 1 : 2;
  }

  setFormValidation(): void {
    this.reservationFormGroup = this.formBuilder.group({
      selectedLab: ['', Validators.required],
      selectedKit: ['', Validators.required],
      selectedHour: ['', Validators.required],
      selectedDate: ['', Validators.required],
    });
  }

  get selectedKit(): Kit {
    return this.reservationFormGroup.controls['selectedKit'].value;
  }

  get selectedLab(): Lab {
    return this.reservationFormGroup.controls['selectedLab'].value;
  }

  get selectedDate(): Date {
    return this.reservationFormGroup.controls['selectedDate'].value;
  }

  selectFirstAvailableLab(): void {
    if (this.labs.length > 0) {
      const selectedLab = this.labs[0];

      this.reservationFormGroup.controls['selectedLab'].setValue(selectedLab);

      this.getKitsByLabId(selectedLab.id!);
    }
  }

  getKitsByLabId(labId: number): void {
    this.kitService.getKitsByLabId(labId).subscribe((kits) => {
      this.kits = kits.reverse();

      this.setDataFromFirstAvailableKit();
    });
  }

  setDataFromFirstAvailableKit(): void {
    if (this.kits.length > 0) {
      this.noAvailableData = false;

      const selectedKit = this.kits[0];

      this.reservationFormGroup.controls['selectedKit'].setValue(selectedKit);
      this.getHoursByKitIdAndDate(selectedKit.id, this.startAt);
    } else {
      this.noAvailableData = true;
    }
  }

  getHoursByKitIdAndDate(kitId: number, selectedDate: Date): void {
    let availableDates: AvailableDate[] = [];
    this.bookingService
      .getBookingListByKitId(kitId)
      .subscribe((bookingList) => {
        bookingList.forEach((booking) => {
          if (booking.available) {
            let formattedDate = moment(booking.start_date).format(
              this.dateFormat
            );
            let formattedHour = moment(booking.start_date).format(
              this.hourFormat
            );
            let availableDate = {
              formattedDate: formattedDate,
              hour: {
                bookingId: booking.id,
                formattedHour: formattedHour,
              },
            };
            availableDates.push(availableDate);
          }
        });

        this.availableHoursBySelectedDate = availableDates.filter(
          (availableDate) =>
            availableDate.formattedDate ===
            moment(selectedDate).format(this.dateFormat)
        );
      });
  }

  updateSelectedHour(bookingId: number): void {
    this.reservationFormGroup.controls['selectedHour'].setValue(bookingId);
  }

  onSelectDate(event: any): void {
    this.reservationFormGroup.controls['selectedDate'].setValue(event);
    let kit = this.reservationFormGroup.controls['selectedKit'].value;
    this.getHoursByKitIdAndDate(kit.id, event);
  }

  followNextStep() {
    this.bookingId = this.reservationFormGroup.controls['selectedHour'].value;
  }

  saveReservation(): void {
    this.isEditable = false;
    this.delay(1000).then(
      (_) =>
        (this.accessUrl = 'https://lab/#adsdadasd485555a5a55aadfidjnnnlvpp')
    );
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
