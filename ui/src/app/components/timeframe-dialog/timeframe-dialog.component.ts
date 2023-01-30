/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  title = 'Register timeframe';

  selectedTimeframeId = 0;
  kitId = 0;

  timeframeForm = new FormGroup({
    dates: new FormGroup({
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
    }),
    startHour: new FormControl('', [Validators.required]),
    endHour: new FormControl('', [Validators.required]),
    slotDuration: new FormControl('', [Validators.required]),
  });

  minDate = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: Timeframe,
    private dialogRef: MatDialogRef<TimeframeDialogComponent>,
    private toastr: ToastrService,
    private timeframeService: TimeframeService
  ) {}

  ngOnInit(): void {
    this.kitId = this.dialogData.kit!;

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

      this.title = 'Update timeframe';
    } else {
      this.title = 'Register timeframe';
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
    newTimeframe.kit = this.kitId;

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
    timeframe.start_hour = this.timeframeForm.get('startHour')?.value;
    timeframe.end_hour = this.timeframeForm.get('endHour')?.value;
    timeframe.slot_duration = this.timeframeForm.get('slotDuration')?.value;
    timeframe.kit = this.kitId;

    return timeframe;
  }

  resetDialog(msg?: string) {
    if (msg) this.toastr.success(msg);
    this.timeframeForm.reset();
    this.dialogRef.close(msg);
  }
}
