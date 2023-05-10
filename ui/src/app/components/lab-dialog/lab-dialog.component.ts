/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LabService } from 'src/app/services/lab.service';

@Component({
  selector: 'app-lab-dialog',
  templateUrl: './lab-dialog.component.html',
  styleUrls: ['./lab-dialog.component.css'],
})
export class LabDialogComponent implements OnInit {
  title = 'Register laboratory';

  selectedLabId = 0;

  labForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    instructor: new UntypedFormControl('', [Validators.required]),
    university: new UntypedFormControl('', [Validators.required]),
    course: new UntypedFormControl('', [Validators.required]),
    image: new UntypedFormControl(null, [Validators.required]),
    visible: new UntypedFormControl(false, [Validators.required]),
    url: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(
        '(\b(https?|ftp|file)://)?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      ),
    ]),
    description: new UntypedFormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<LabDialogComponent>,
    private toastr: ToastrService,
    private labService: LabService
  ) {}

  get urlControl() {
    return this.labForm.controls['url'];
  }

  get imageControl() {
    return this.labForm.controls['image'];
  }

  getUrlErrorMessage() {
    if (this.urlControl.hasError('required')) return 'Please provide url.';

    return this.urlControl.hasError('pattern')
      ? 'Please provide a valid url.'
      : '';
  }

  ngOnInit(): void {
    if (this.dialogData) {
      const lab = this.dialogData;

      this.selectedLabId = lab.id;
      this.labForm.controls['name'].setValue(lab.name!);
      this.labForm.controls['instructor'].setValue(lab.instructor!);
      this.labForm.controls['university'].setValue(lab.university!);
      this.labForm.controls['course'].setValue(lab.course!);
      this.labForm.controls['image'].setValue(lab.image);
      this.labForm.controls['url'].setValue(lab.url!);
      this.labForm.controls['description'].setValue(lab.description);
      this.labForm.controls['visible'].setValue(lab.visible);

      this.title = 'Update laboratory';
    } else {
      this.title = 'Register laboratory';
    }
  }

  addLab(): void {
    this.labService.addLab(this.labForm.value).subscribe({
      next: (_) => {
        this.resetDialog('The lab has been created successfully.');
      },
      error: (e) => {
        this.toastr.error(
          'There was an error creating the lab. Please try later.'
        );
      },
    });
  }

  updateLab(): void {
    this.labService
      .updateLab(this.labForm.value, this.selectedLabId)
      .subscribe({
        next: (_) => {
          this.resetDialog('The lab has been updated successfully.');
        },
        error: (e) => {
          this.toastr.error(
            'There was an error updating the lab. Please try later.'
          );
        },
      });
  }

  save(): void {
    if (this.labForm.valid) {
      if (!this.dialogData) this.addLab();
      else this.updateLab();
    } else {
      this.toastr.error('Please fill in correctly the data.');
    }
  }

  resetDialog(msg?: string) {
    if (msg) this.toastr.success(msg);
    this.labForm.reset();
    this.dialogRef.close(msg);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.imageControl.setValue(file);
    }
  }
}
