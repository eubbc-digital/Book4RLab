import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabService } from 'src/app/services/lab.service';
import { KitService } from 'src/app/services/kit.service';
import { Lab } from 'src/app/interfaces/lab';
import { Kit } from 'src/app/interfaces/kit';
import { AvailableDate } from 'src/app/interfaces/available-date';
import { BookingService } from 'src/app/services/booking.service';
import * as moment from 'moment';
import config from '../../config.json';
import { Booking } from 'src/app/interfaces/booking';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-stepper',
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.css'],
})
export class BookingStepperComponent implements OnInit {
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  @ViewChild('stepper', { read: MatStepper }) private stepper!: MatStepper;

  reservationFormGroup!: FormGroup;
  confirmationFormGroup!: FormGroup;

  cols: number;
  bookingId: number = 0;

  startAt = new Date();
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 5));

  dateFormat: string = 'MM/DD/YYYY';
  dateTimeFormat: string = 'MMMM Do YYYY, h:mm a';
  hourFormat: string = 'hh:mm a';

  stepperOrientation: Observable<StepperOrientation>;

  labs: Lab[] = [];
  kits: Kit[] = [];
  availableHoursBySelectedDate: AvailableDate[] = [];

  isEditable: boolean = true;
  noAvailableData: boolean = false;

  privateAccessUrl!: string;
  publicAccessUrl!: string;
  reservationDate: string = '';

  timerConfig = {
    leftTime: 420,
    format: 'mm:ss',
  };

  constructor(
    private formBuilder: FormBuilder,
    private labService: LabService,
    private kitService: KitService,
    private bookingService: BookingService,
    private toastService: ToastrService,
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
      this.initializeCountdown();
      this.selectFirstAvailableLab();
    });
  }

  handleSize(event: any) {
    this.cols = event.target.innerWidth <= 900 ? 1 : 2;
  }

  initializeCountdown(): void {
    this.countdown.stop();
  }

  setFormValidation(): void {
    this.reservationFormGroup = this.formBuilder.group({
      selectedLab: ['', Validators.required],
      selectedKit: ['', Validators.required],
      selectedHour: ['', Validators.required],
      selectedDate: [this.startAt, Validators.required],
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
          if (
            booking.available &&
            this.isAvailableDateValid(booking.start_date)
          ) {
            let formattedDate = this.getFormattedDate(
              booking.start_date,
              this.dateFormat
            );
            let formattedHour = this.getFormattedDate(
              booking.start_date,
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

        let formattedSelectedDate = this.getFormattedDate(
          selectedDate,
          this.dateFormat
        );

        this.availableHoursBySelectedDate = availableDates.filter(
          (availableDate) =>
            availableDate.formattedDate == formattedSelectedDate
        );
      });
  }

  isAvailableDateValid(date: string | undefined): boolean {
    return date !== null && moment(date).isAfter(moment());
  }

  getFormattedDate(date: string | undefined | Date, format: string): any {
    return moment(date).format(format);
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
    this.saveReservation();
  }

  saveReservation(): void {
    let booking: Booking = {
      id: this.bookingId,
      available: false,
    };

    this.countdown.restart();

    this.bookingService.updateBooking(booking).subscribe((updatedBooking) => {
      this.privateAccessUrl = `${config.remoteLabUrl}${updatedBooking.access_id}`;
      this.publicAccessUrl = `${this.privateAccessUrl}?pwd=${updatedBooking.password}`;
      this.reservationDate = moment(updatedBooking.start_date).format(
        this.dateTimeFormat
      );
    });
  }

  undoReservation(): void {
    if (this.bookingId !== 0) {
      let booking: Booking = {
        id: this.bookingId,
        available: true,
      };

      this.bookingService.updateBooking(booking).subscribe((_) => {
        this.privateAccessUrl = '';
        this.publicAccessUrl = '';
        this.reservationDate = '';

        this.countdown.restart();
        this.countdown.stop();

        this.bookingId = 0;
      });
    }
  }

  confirmReservation(): void {
    this.isEditable = false;

    if (this.privateAccessUrl !== '' && this.publicAccessUrl !== '') {
      this.toastService.success('Reservation made successfully');
      this.countdown.stop();
      this.bookingId = 0;
    }
  }

  handleEvent(e: CountdownEvent) {
    if (e.action == 'done') {
      this.resetStepper();
      this.toastService.error(
        'The remaining time to make a reservation has ended'
      );
    }
  }

  resetStepper(): void {
    this.countdown.restart();
    this.countdown.stop();

    this.stepper.reset();

    if (this.bookingId !== 0) this.undoReservation();

    this.selectFirstAvailableLab();
  }

  onStepChange(event: any) {
    if (event.selectedIndex == 0 && event.previouslySelectedIndex == 1) {
      this.undoReservation();
      this.resetSelectedHour();
    }
  }

  resetSelectedHour(): void {
    this.reservationFormGroup.controls['selectedHour'].reset();
  }
}
