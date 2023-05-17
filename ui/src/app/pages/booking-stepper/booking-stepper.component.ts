/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { ComponentCanDeactivate } from '../../services/guards/pending-changes.guard';

import { LabService } from 'src/app/services/lab.service';
import { KitService } from 'src/app/services/kit.service';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/booking.service';
import { UserService } from 'src/app/services/user.service';

import { Lab } from 'src/app/interfaces/lab';
import { Kit } from 'src/app/interfaces/kit';
import { Booking } from 'src/app/interfaces/booking';
import { AvailableDate } from 'src/app/interfaces/available-date';

import config from '../../config.json';

@Component({
  selector: 'app-booking-stepper',
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.css'],
})
export class BookingStepperComponent implements OnInit, ComponentCanDeactivate {
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  @ViewChild('stepper', { read: MatStepper }) private stepper!: MatStepper;

  @HostListener('window:unload', ['$event'])
  unloadHandler(event: any) {
    this.undoReservation();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: any) {
    if (this.bookingId !== 0) return false;

    return true;
  }

  reservationFormGroup!: FormGroup;
  confirmationFormGroup!: FormGroup;

  cols: number;
  bookingId: number = 0;

  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 5));

  dateFormat: string = 'MM/DD/YYYY';
  dateTimeFormat: string = 'MMMM Do YYYY, h:mm a';
  hourFormat: string = 'hh:mm a';

  stepperOrientation: Observable<StepperOrientation>;

  kits: Kit[] = [];
  availableHoursBySelectedDate: AvailableDate[] = [];
  availableDates: AvailableDate[] = [];

  isEditable: boolean = true;
  showSpinner: boolean = false;
  publicReservation: boolean = false;
  confirmedReservation: boolean = false;
  isFirstStepCompleted: boolean = false;

  dateChanged = false;
  showCalendar = false;
  changeMonth = false;

  privateAccessUrl!: string;
  publicAccessUrl!: string;
  reservationDate: string = '';

  timerConfig = {
    leftTime: 420,
    format: 'mm:ss',
  };

  private subscription: any;

  dateClass!: (cellDate: Date, view: any) => any;

  canDeactivate(): Observable<boolean> | boolean {
    if (this.bookingId != 0) {
      let confirmUndoReservation = confirm(
        'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.'
      );

      if (!confirmUndoReservation) return false;
      else this.undoReservation();
    }

    return true;
  }

  constructor(
    private formBuilder: FormBuilder,
    private labService: LabService,
    private kitService: KitService,
    private bookingService: BookingService,
    private toastService: ToastrService,
    private userService: UserService,
    breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute
  ) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.setFormValidation();

    this.subscription = this.route.params.subscribe((params) => {
      const id = +params['id'];

      this.labService.getLabById(id).subscribe((lab) => {
        this.reservationFormGroup.controls['selectedLab'].setValue(lab);
        this.getKitsByLabId(lab.id!);
      });
    });
  }

  ngAfterViewInit() {
    this.initializeCountdown();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setupCalendarClass() {
    this.dateClass = (cellDate, view) => {
      if (view === 'month') {
        const date = cellDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        const availableReservations = this.getAvailableReservationsByDate(date);

        if (availableReservations == 0) return [''];
        else if (availableReservations < 5) return ['yellow-date'];
        else return ['green-date'];
      }
      return [''];
    };
  }

  getAvailableReservationsByDate(date: string): number {
    let reservations = this.availableDates.filter(
      (availableDate) => availableDate.formattedDate == date
    );

    return reservations.length;
  }

  handleSize(event: any) {
    this.cols = event.target.innerWidth <= 900 ? 1 : 2;
  }

  initializeCountdown(): void {
    this.countdown.stop();
  }

  setFormValidation(): void {
    this.reservationFormGroup = this.formBuilder.group({
      selectedLab: [<Lab>{}, Validators.required],
      selectedKit: ['', Validators.required],
      selectedHour: ['', Validators.required],
      selectedDate: [new Date(), Validators.required],
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

  getKitsByLabId(labId: number): void {
    this.kitService.getKitsByLabId(labId).subscribe((kits) => {
      this.kits = kits;

      if (this.kits.length > 0) this.setDataFromFirstAvailableKit();
      else this.showCalendar = true;
    });
  }

  setDataFromFirstAvailableKit(): void {
    const selectedKit = this.kits[0];

    this.reservationFormGroup.controls['selectedKit'].setValue(selectedKit);

    this.dateChanged = false;

    this.getHoursByKitIdAndDate(selectedKit.id!, this.selectedDate);
  }

  getHoursByKitIdAndDate(kitId: number, selectedDate: Date): void {
    if (!this.dateChanged) this.showCalendar = false;

    this.showSpinner = true;

    this.availableDates = [];

    this.bookingService
      .getBookingListByKitId(kitId)
      .subscribe((bookingList) => {
        bookingList.forEach((booking) => {
          if (
            booking.available &&
            this.isAvailableDateValid(booking.end_date)
          ) {
            let formattedDate = this.getFormattedDate(
              booking.start_date,
              this.dateFormat
            );

            let formattedStartHour = this.getFormattedDate(
              booking.start_date,
              this.hourFormat
            );

            let formattedEndHour = this.getFormattedDate(
              booking.end_date,
              this.hourFormat
            );

            let availableDate = {
              formattedDate: formattedDate,
              hour: {
                bookingId: booking.id,
                formattedStartHour: formattedStartHour,
                formattedEndHour: formattedEndHour,
              },
            };
            this.availableDates.push(availableDate);
          }
        });

        let formattedSelectedDate = this.getFormattedDate(
          selectedDate,
          this.dateFormat
        );

        this.availableHoursBySelectedDate = this.availableDates.filter(
          (availableDate) =>
            availableDate.formattedDate == formattedSelectedDate
        );

        this.setupCalendarClass();

        if (!this.dateChanged) this.showCalendar = true;

        this.showSpinner = false;
      });
  }

  isAvailableDateValid(endDate: string | undefined): boolean {
    return endDate !== null && moment(moment()).isBefore(endDate);
  }

  getFormattedDate(date: string | undefined | Date, format: string): any {
    return moment(date).format(format);
  }

  updateSelectedHour(bookingId: number): void {
    this.reservationFormGroup.controls['selectedHour'].setValue(bookingId);
  }

  onSelectDate(event: any): void {
    this.dateChanged = true;
    this.reservationFormGroup.controls['selectedDate'].setValue(event);
    let kit = this.reservationFormGroup.controls['selectedKit'].value;
    this.getHoursByKitIdAndDate(kit.id, event);
  }

  followNextStep() {
    this.bookingId = this.reservationFormGroup.controls['selectedHour'].value;

    this.bookingService.getBookingById(this.bookingId).subscribe((booking) => {
      if (booking !== undefined && booking.available) {
        this.isFirstStepCompleted = true;

        this.saveReservation();
      } else {
        this.toastService.error(
          'This booking is not available. Please choose another.'
        );

        this.getHoursByKitIdAndDate(this.selectedKit.id!, this.selectedDate);
        this.bookingId = 0;
      }
    });
  }

  updateReservationType(publicReservation: any): void {
    this.publicReservation = publicReservation;
  }

  saveReservation(): void {
    let booking: Booking = {
      id: this.bookingId,
      available: false,
      public: this.publicReservation,
    };

    if (!this.confirmedReservation) {
      this.countdown.restart();

      this.bookingService
        .registerBooking(booking)
        .subscribe((updatedBooking) => {
          this.userService.getUserData().subscribe((response) => {
            if (response && response.id == updatedBooking.reserved_by) {
              this.privateAccessUrl = `${this.selectedLab.url}?${config.urlParams.accessKey}=${updatedBooking.access_key}&${config.urlParams.password}=${updatedBooking.password}`;
              this.publicAccessUrl = this.publicReservation
                ? `${this.selectedLab.url}?${config.urlParams.accessKey}=${updatedBooking.access_key}`
                : '';
              this.reservationDate = moment(updatedBooking.start_date).format(
                this.dateTimeFormat
              );

              this.stepper.next();
            } else {
              this.toastService.error(
                'This booking is not available. Please choose another.'
              );

              this.getHoursByKitIdAndDate(
                this.selectedKit.id!,
                this.selectedDate
              );

              this.bookingId = 0;
            }
          });
        });
    } else {
      this.bookingService
        .confirmBooking(booking)
        .subscribe((confirmedBooking) => {
          this.privateAccessUrl = `${this.selectedLab.url}?${config.urlParams.accessKey}=${confirmedBooking.access_key}&${config.urlParams.password}=${confirmedBooking.password}`;
          this.publicAccessUrl = this.publicReservation
            ? `${this.selectedLab.url}?${config.urlParams.accessKey}=${confirmedBooking.access_key}`
            : '';
          this.reservationDate = moment(confirmedBooking.start_date).format(
            this.dateTimeFormat
          );
        });
    }
  }

  undoReservation(): void {
    if (this.bookingId !== 0) {
      let booking: Booking = {
        id: this.bookingId,
        available: true,
        public: false,
        reserved_by: null,
      };

      this.bookingService.updateBooking(booking).subscribe((_) => {
        this.privateAccessUrl = '';
        this.publicAccessUrl = '';
        this.reservationDate = '';
      });

      this.countdown.restart();
      this.countdown.stop();
    }
  }

  confirmReservation(): void {
    this.isEditable = false;
    this.confirmedReservation = true;

    this.saveReservation();

    if (this.privateAccessUrl !== '') {
      this.toastService.success('Reservation made successfully');

      this.countdown.stop();

      this.resetBookingId();
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

    this.isFirstStepCompleted = false;
    this.confirmedReservation = false;
    this.stepper.reset();

    if (this.bookingId !== 0) {
      this.undoReservation();
      this.resetBookingId();
    }

    this.getKitsByLabId(this.selectedLab.id!);
  }

  onStepChange(event: any) {
    if (event.selectedIndex == 0 && event.previouslySelectedIndex == 1)
      this.undoReservation();
  }

  resetBookingId(): void {
    this.bookingId = 0;
  }

  resetSelectedHour(): void {
    this.reservationFormGroup.controls['selectedHour'].reset();
  }
}
