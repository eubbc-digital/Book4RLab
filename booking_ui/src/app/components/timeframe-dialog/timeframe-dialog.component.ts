/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeframeService } from 'src/app/services/timeframe.service';
import { ToastrService } from 'ngx-toastr';
import { Timeframe } from 'src/app/interfaces/timeframe';

@Component({
  selector: 'app-timeframe-dialog',
  templateUrl: './timeframe-dialog.component.html',
  styleUrls: ['./timeframe-dialog.component.css'],
})
export class TimeframeDialogComponent implements OnInit {
  title = 'Register Timeframe';

  selectedTimeframeId = 0;
  equipmentId = 0;

  timeframeForm = new UntypedFormGroup({
    dates: new UntypedFormGroup({
      start: new UntypedFormControl('', [Validators.required]),
      end: new UntypedFormControl('', [Validators.required]),
    }),
    startHour: new UntypedFormControl('', [Validators.required]),
    endHour: new UntypedFormControl('', [
      Validators.required,
      this.endDateValidator(),
    ]),
    slotDuration: new UntypedFormControl('', [Validators.required]),
  });

  minDate = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: Timeframe,
    private dialogRef: MatDialogRef<TimeframeDialogComponent>,
    private toastr: ToastrService,
    private timeframeService: TimeframeService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.equipmentId = this.dialogData.equipment!;

    if (this.dialogData.id) {
      const timeframe = this.dialogData;

      this.selectedTimeframeId = timeframe.id!;
      this.startDateControl?.setValue(timeframe.start_date);
      this.endDateControl?.setValue(timeframe.end_date);
      this.timeframeForm.controls['startHour'].setValue(timeframe.start_hour!);
      this.timeframeForm.controls['endHour'].setValue(timeframe.end_hour!);
      this.timeframeForm.controls['slotDuration'].setValue(
        timeframe.slot_duration!
      );

      this.title = 'Update Timeframe';
    } else {
      this.title = 'Register Timeframe';
    }
  }

  get startDateControl() {
    return this.timeframeForm.get('dates.start');
  }

  get endDateControl() {
    return this.timeframeForm.get('dates.end');
  }

  get slotDurationControl() {
    return this.timeframeForm.get('slotDuration');
  }

  get startHourControl() {
    return this.timeframeForm.get('startHour');
  }

  get endHourControl() {
    return this.timeframeForm.get('endHour');
  }

  addTimeframe(): void {
    const timeframe = this.getFormattedTimeframe();

    this.timeframeService.addTimeframe(timeframe).subscribe({
      next: (_) => {
        this.resetDialog('The timeframe has been created successfully.');
      },
      error: (e) => {
        if (e.error[0]) this.toastr.error(e.error[0]);
        else
          this.toastr.error(
            'There was an error creating the timeframe. Please try later.'
          );
      },
    });
  }

  updateTimeframe(): void {
    let newTimeframe = this.timeframeForm.value;
    newTimeframe.equipment = this.equipmentId;

    this.timeframeService
      .updateTimeframe(newTimeframe, this.selectedTimeframeId)
      .subscribe({
        next: (_) => {
          this.resetDialog('The timeframe has been updated successfully.');
        },
        error: (e) => {
          this.toastr.error(
            'There was an error updating the timeframe. Please try later.'
          );
        },
      });
  }

  save(): void {
    if (this.timeframeForm.valid) {
      if (this.dialogData.id) this.updateTimeframe();
      else this.addTimeframe();
    } else {
      this.toastr.error('Please fill in correctly the data.');
    }
  }

  getFormattedTimeframe(): Timeframe {
    const timeframe: Timeframe = {};

    timeframe.start_date = this.startDateControl?.value;
    timeframe.end_date = this.endDateControl?.value;
    timeframe.start_hour = this.convertHourToUTC(this.startHourControl?.value);
    timeframe.end_hour = this.convertHourToUTC(this.endHourControl?.value);
    timeframe.slot_duration = this.timeframeForm.get('slotDuration')?.value;
    timeframe.equipment = this.equipmentId;

    return timeframe;
  }

  resetDialog(msg?: string) {
    if (msg) this.toastr.success(msg);
    this.timeframeForm.reset();
    this.dialogRef.close(msg);
  }

  convertHourToUTC(hour: string): string {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    const fpHour = Number(hour.split(':')[0]);
    let localTime;

    if (fpHour > 12 || fpHour == 0)
      localTime = new Date(
        date.toLocaleDateString('en-US', { hour12: false }) + ' ' + hour
      );
    else localTime = new Date(date.toLocaleDateString('en-US', { hour12: true }) + ' ' + hour);

    const utcTime = new Date(localTime.getTime() + timezoneOffset);

    return utcTime.toString().substring(16, 21);
  }

  endDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.timeframeForm) {
        const date = new Date();
        const startDate = new Date(
          date.toLocaleDateString() + ' ' + this.startHourControl?.value
        );
        const endDate = new Date(
          date.toLocaleDateString() + ' ' + control.value
        );

        return endDate <= startDate ? { invalidEndHour: true } : null;
      } else return null;
    };
  }
}
