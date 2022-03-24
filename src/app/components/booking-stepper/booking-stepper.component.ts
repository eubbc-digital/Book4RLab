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

  reservationData = { lab: '', datetime: '', kit: '' };

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

  setFormValidation(): void {
    this.reservationFormGroup = this.formBuilder.group({
      selectedLab: ['', Validators.required],
      selectedKit: ['', Validators.required],
      selectedHour: ['', Validators.required],
      selectedDate: ['', Validators.required],
    });
  }

  selectFirstAvailableLab(): void {
    if (this.labs.length > 0) {
      const selectedLab = this.labs[0];

      this.reservationFormGroup.controls['selectedLab'].setValue(
        selectedLab.id
      );

      this.getKitsByLabId(selectedLab.id!);
    }
  }

  getKitsByLabId(labId: number): void {
    this.kitService.getKitsByLabId(labId).subscribe((kits) => {
      this.kits = kits;

      this.setDataFromFirstAvailableKit();
    });
  }

  setDataFromFirstAvailableKit(): void {
    if (this.kits.length > 0) {
      this.noAvailableData = false;

      const selectedKit = this.kits[0];

      this.reservationFormGroup.controls['selectedKit'].setValue(
        selectedKit.id
      );

      this.getDatesByKitId(selectedKit.id);
    } else {
      this.noAvailableData = true;
    }
  }

  getDatesByKitId(kitId: number): void {
    // get dates and hours
  }

  handleSize(event: any) {
    this.cols = event.target.innerWidth <= 900 ? 1 : 2;
  }

  updateSelectedHour(id: number): void {
    this.reservationFormGroup.controls['selectedHour'].setValue(id);
  }

  onSelectDate(event: Event): void {
    this.reservationFormGroup.controls['selectedDate'].setValue(event);
  }

  onSubmit() {
    this.reservationData = {
      lab: '',
      datetime: 'Wed Dec 08 2021 12:06:20 GMT-0400 (Bolivia Time)',
      kit: this.kits.filter((kit) => kit.id === 1)[0].name,
    };
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
