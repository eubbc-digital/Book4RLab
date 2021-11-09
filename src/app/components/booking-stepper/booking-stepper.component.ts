import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-booking-stepper',
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.css'],
})
export class BookingStepperComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  cols: number;
  selectedDate = new Date();
  startAt = new Date();
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 5));
  stepperOrientation: Observable<StepperOrientation>;
  materialsFormControl = new FormControl();
  materials: string[] = ['Spectrometer', 'Computer', 'Camera', 'Tripod'];

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver
  ) {
    this.cols = window.innerWidth <= 900 ? 1 : 2;
    this.onSelect(this.selectedDate);
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  handleSize(event: any) {
    this.cols = event.target.innerWidth <= 900 ? 1 : 2;
  }

  onSelect(event: any) {
    this.selectedDate = event;
  }
}
