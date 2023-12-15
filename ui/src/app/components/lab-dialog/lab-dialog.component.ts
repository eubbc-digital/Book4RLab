/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LabDescriptionComponent } from 'src/app/pages/lab-description/lab-description.component';
import { LabService } from 'src/app/services/lab.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-lab-dialog',
  templateUrl: './lab-dialog.component.html',
  styleUrls: ['./lab-dialog.component.css'],
})
export class LabDialogComponent implements OnInit {
  @ViewChild(LabDescriptionComponent) labDescription!: LabDescriptionComponent;

  title = 'Register laboratory';
  imageName = '';

  selectedLabId = 0;

  submitted = false;

  lab!: any;

  labForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    instructor: new UntypedFormControl('', [Validators.required]),
    university: new UntypedFormControl('', [Validators.required]),
    course: new UntypedFormControl('', [Validators.required]),
    image: new UntypedFormControl(null),
    visible: new UntypedFormControl(false, [Validators.required]),
    url: new UntypedFormControl('', [
      Validators.required,
      this.trimAndValidateUrl,
    ]),
    description: new UntypedFormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<LabDialogComponent>,
    private toastr: ToastrService,
    private labService: LabService
  ) {}

  trimAndValidateUrl(control: AbstractControl) {
    const value = control.value;

    if (typeof value === 'string') {
      const trimmedValue = value.trim();

      return Validators.pattern(
        '(\b(https?|ftp|file)://)?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      )(new FormControl(trimmedValue));
    }

    return null;
  }

  get urlControl() {
    return this.labForm.controls['url'];
  }

  get imageControl() {
    return this.labForm.controls['image'];
  }

  get descriptionControl() {
    return this.labForm.controls['description'];
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
      this.lab = lab;

      this.selectedLabId = lab.id;
      this.labForm.controls['name'].setValue(lab.name!);
      this.labForm.controls['instructor'].setValue(lab.instructor!);
      this.labForm.controls['university'].setValue(lab.university!);
      this.labForm.controls['course'].setValue(lab.course!);
      this.imageName = this.getImageName(lab.image);
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

  async save() {
    this.cleanDescription();
    var descriptionParams = await this.getDescriptionParams(
      this.labDescription.components
    );

    if (descriptionParams.length == 0) {
      await lastValueFrom(this.labService.deleteLabContent(this.selectedLabId));
    } else {
      await this.labService.postLabContent(descriptionParams);
    }

    if (this.labForm.valid) {
      if (!this.dialogData) this.addLab();
      else this.updateLab();
    } else {
      this.toastr.error('Please fill in correctly the data.');
      this.displayFormErrors();
    }
  }

  async getDescriptionParams(descriptionArray: any[]) {
    var params: any[] = [];
    for (var i = 0; i < descriptionArray.length; i++) {
      if (
        descriptionArray[i]['image'] &&
        typeof descriptionArray[i]['image'] == 'string'
      ) {
        var blobImage = await lastValueFrom(
          this.labService.getLabFile(descriptionArray[i]['image'])
        );
        var fileType = this.getImageName(descriptionArray[i]['image']);
        const file = new File([blobImage], fileType);
        params.push({
          laboratory: this.selectedLabId,
          order: i + 1,
          image: file,
        });
      } else if (
        descriptionArray[i]['video'] &&
        typeof descriptionArray[i]['video'] == 'string'
      ) {
        var blobVideo = await lastValueFrom(
          this.labService.getLabFile(descriptionArray[i]['video'])
        );
        var fileType = this.getImageName(descriptionArray[i]['video']);
        const file = new File([blobVideo], fileType);
        params.push({
          laboratory: this.selectedLabId,
          order: i + 1,
          video: file,
        });
      } else {
        descriptionArray[i].laboratory = this.selectedLabId;
        descriptionArray[i].order = i + 1;
        params.push(descriptionArray[i]);
      }
    }
    return params;
  }

  async getBlobContent(fileUrl:string){
    let blob = await fetch(fileUrl).then(r => r.blob());
    return blob;
  }

  cleanDescription(): void {
    let description = this.descriptionControl.value.replace(/\r\n/g, '\n');
    this.descriptionControl.setValue(description);
  }

  resetDialog(msg?: string): void {
    if (msg) this.toastr.success(msg);
    this.labForm.reset();
    this.dialogRef.close(msg);
  }

  closeDialog(msg?: string): void {
    this.dialogRef.close('lab-description');
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.imageName = file.name;
      this.imageControl.setValue(file);
    }
  }

  getImageName(imageName: string | null): string {
    const defaultImage = 'default.jpeg';
    return imageName
      ? imageName.split('/').pop() ?? defaultImage
      : defaultImage;
  }

  displayFormErrors(): void {
    Object.keys(this.labForm.controls).forEach((controlName) => {
      const control = this.labForm.controls[controlName];
      control.markAsTouched();
    });
  }
}
