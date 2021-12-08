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

@Component({
  selector: 'app-booking-stepper',
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.css'],
})
export class BookingStepperComponent implements OnInit {
  reservationFormGroup!: FormGroup;
  confirmationFormGroup!: FormGroup;

  cols: number;

  startAt = new Date();
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 5));

  stepperOrientation: Observable<StepperOrientation>;

  labs: Lab[] = [];
  kits: Kit[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private labService: LabService,
    private kitService: KitService,
    breakpointObserver: BreakpointObserver
  ) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;
    this.labs = this.labService.getLabs();
    this.kits = this.kitService.getKits();

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.createFormValidation();
  }

  createFormValidation(): void {
    this.reservationFormGroup = this.formBuilder.group({
      selectedLab: ['', Validators.required],
      selectedKit: ['', Validators.required],
      selectedHour: ['', Validators.required],
      selectedDate: ['', Validators.required],
    });
  }

  handleSize(event: any) {
    this.cols = event.target.innerWidth <= 900 ? 1 : 2;
  }

  updateSelectedHour(id: number) {
    this.reservationFormGroup.controls['selectedHour'].setValue(id);
  }

  onSelectDate(event: Event): void {
    this.reservationFormGroup.controls['selectedDate'].setValue(event);
  }
}
