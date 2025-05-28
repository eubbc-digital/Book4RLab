/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Lab } from 'src/app/interfaces/lab';
import { LabDescriptionComponent } from 'src/app/pages/lab-description/lab-description.component';
import { LabService } from 'src/app/services/lab.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-lab-dialog',
  templateUrl: './lab-dialog.component.html',
  styleUrls: ['./lab-dialog.component.css'],
})

export class LabDialogComponent implements OnInit {
  @ViewChild(LabDescriptionComponent) labDescription!: LabDescriptionComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<LabDialogComponent>,
    private toastr: ToastrService,
    private labService: LabService,
    private fb: FormBuilder,
    private userService: UserService,
  ) { }


  title = 'Register laboratory';
  imageName = '';
  selectedLabId = 0;
  submitted = false;
  onUpdate!: boolean;
  lab!: any;
  laboratoryTypes = [
    { value: 'rt', viewValue: 'Real Time' },
    { value: 'uc', viewValue: 'Ultra Concurrent' },
  ];

  labForm = this.fb.group({
    name: ['', Validators.required],
    instructor: this.fb.array([]),
    university: ['', Validators.required],
    course: ['', Validators.required],
    image: [null as File | null],
    visible: [false, Validators.required],
    url: ['', [Validators.required, this.trimAndValidateUrl]],
    description: ['', Validators.required],
    notify_owner: [false, Validators.required],
    allowed_emails: this.fb.array([]),
    type: ['', Validators.required]
  });

  get urlControl() { return this.labForm.controls['url']; }
  get imageControl() { return this.labForm.controls['image']; }
  get descriptionControl() { return this.labForm.controls['description']; }
  ngOnInit(): void {
    if (this.dialogData) {
      const lab = this.dialogData;
      this.selectedLabId = lab.id;

      this.labForm.patchValue({
        name: lab.name,
        university: lab.university,
        course: lab.course,
        image: lab.image,
        visible: lab.visible,
        url: lab.url,
        description: lab.description,
        notify_owner: lab.notify_owner,
        type: lab.type
      });
      this.populateInstructors(lab.instructor);
      this.populateAllowedEmails(lab.allowed_emails);

      this.title = 'Update Laboratory';
      this.onUpdate = true;
      this.displayFormErrors();
    } else {
      this.title = 'Register Laboratory';
      this.onUpdate = false;

      const instructorsFormArray = this.labForm.get('instructor') as FormArray;
      instructorsFormArray.push(this.fb.control('', [Validators.required, this.trimAndValidateFullName]));
    }
  }

  async save() {
    this.cleanDescription();

    if (!this.arraysAreEqual(this.labDescription.components, (this.labDescription.myLabContent || []))) {
      var descriptionParams = await this.getDescriptionParams(this.labDescription.components);
      if (descriptionParams.length == 0) {
        await lastValueFrom(this.labService.deleteLabContent(this.selectedLabId));
      } else {
        await this.labService.postLabContent(descriptionParams);
      }
    }

    if (this.labForm.valid) {
      if (!this.dialogData) this.addLab();
      else this.updateLab();
    } else {
      this.toastr.error('Please fill in correctly the data.');
      this.displayFormErrors();
    }
  }

  addLab(): void {
    this.labService.addLab(this.labForm.value as Lab).subscribe({
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
      .updateLab(this.labForm.value as Lab, this.selectedLabId)
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

  async getDescriptionParams(descriptionArray: any[]) {
    var params: any[] = [];
    for (var i = 0; i < descriptionArray.length; i++) {
      if (descriptionArray[i]['image'] && typeof descriptionArray[i]['image'] == 'string') {
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
      } else if (descriptionArray[i]['video'] && typeof descriptionArray[i]['video'] == 'string') {
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

  getUrlErrorMessage() {
    if (this.urlControl.hasError('pattern')) {
      return 'Please provide a valid url.';
    }
    return '';
  }

  getEmailMessage(control: AbstractControl) {
    if (control.hasError('email')) {
      return 'Please provide a valid email.';
    }
    return '';
  }

  async getBlobContent(fileUrl: string) {
    let blob = await fetch(fileUrl).then(r => r.blob());
    return blob;
  }

  cleanDescription(): void {
    const descriptionControl = this.descriptionControl;
    if (descriptionControl?.value) {
      let description = descriptionControl.value.replace(/\r\n/g, '\n');
      descriptionControl.setValue(description);
    }
  }

  resetDialog(msg?: string): void {
    if (msg) this.toastr.success(msg);
    this.labForm.reset();
    this.dialogRef.close(msg);
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.imageName = file.name;
      this.imageControl.setValue(file);
    } else {
      this.imageName = '';
      this.imageControl.setValue(null);
    }
  }

  getImageName(imageName: string | null): string {
    const defaultImage = 'default.jpeg';
    return imageName
      ? imageName.split('/').pop() ?? defaultImage
      : defaultImage;
  }

  displayFormErrors(): void {
    (Object.keys(this.labForm.controls) as Array<keyof typeof this.labForm.controls>).forEach(controlKey => {
      const control = this.labForm.controls[controlKey];
      if (control instanceof FormArray) {
        control.controls.forEach(childControl => childControl.markAsTouched());
      } else {
        control.markAsTouched();
      }
    });
  }

  addEmail(): void {
    const emailsFormArray = this.labForm.get('allowed_emails') as FormArray;
    emailsFormArray.push(this.fb.control('', [Validators.required, Validators.email]));
  }

  removeEmail(index: number): void {
    const emailsFormArray = this.labForm.get('allowed_emails') as FormArray;
    emailsFormArray.removeAt(index);
  }

  populateAllowedEmails(emailsString: string): void {
    if (emailsString && emailsString.trim() !== '') {
      const emailsArray = emailsString.split(',');
      const emailsFormArray = this.labForm.get('allowed_emails') as FormArray;
      emailsArray.forEach(email => {
        if (email.trim() !== '') {
          emailsFormArray.push(this.fb.control(email.trim(), [Validators.required, Validators.email]));
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.readFile(file);
  }

  readFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const contents: string = e.target.result;
      this.parseFileContents(contents);
    };
    reader.readAsText(file);
  }

  parseFileContents(contents: string) {
    let newEmails: string[];
    if (contents.includes(',')) {
      newEmails = contents.split(/\s*,\s*/);
    } else {
      newEmails = contents.split(/[\r\n]+/);
    }
    newEmails = newEmails.map(email => email.trim()).filter(email => email !== '');

    const existingEmails: Set<string> = new Set(
      (this.labForm.get('allowed_emails') as FormArray).value.map((email: string) => email.trim())
    );
    const combinedEmails: string[] = Array.from(new Set([...existingEmails, ...newEmails]));

    const allowedEmailsArray = this.labForm.get('allowed_emails') as FormArray;
    allowedEmailsArray.clear();

    combinedEmails.forEach(email => {
      allowedEmailsArray.push(this.fb.control(email.trim(), [Validators.required, Validators.email]));
    });
  }

  arraysAreEqual(simplifiedArray: any, completeArray: any) {
    if (simplifiedArray.length !== completeArray.length) {
      return false;
    }

    for (let i = 0; i < simplifiedArray.length; i++) {
      const simplifiedObj = simplifiedArray[i];
      const completeObj = completeArray[i];
      for (const key in simplifiedObj) {
        if (Object.prototype.hasOwnProperty.call(simplifiedObj, key)) {
          if (simplifiedObj[key] !== completeObj[key]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  addInstructor(): void {
    const instructorsFormArray = this.labForm.get('instructor') as FormArray;
    instructorsFormArray.push(this.fb.control('', [Validators.required, this.trimAndValidateFullName]));
  }

  removeInstructor(index: number): void {
    const instructorsFormArray = this.labForm.get('instructor') as FormArray;
    instructorsFormArray.removeAt(index);
  }

  populateInstructors(instructorsString: string): void {
    if (instructorsString && instructorsString.trim() !== '') {
      const instructorsArray = instructorsString.split(',');
      const instructorsFormArray = this.labForm.get('instructor') as FormArray;
      instructorsArray.forEach(instructor => {
        if (instructor.trim() !== '') {
          instructorsFormArray.push(this.fb.control(instructor.trim(), [Validators.required, this.trimAndValidateFullName]));
        }
      });
    }
  }

  setMeAsInstructor(): void {
    this.userService.getUserData().subscribe((user) => {
      const instructorsFormArray = this.labForm.get('instructor') as FormArray;
      const name = `${user.name} ${user.last_name}`;
      const instructorExists = instructorsFormArray.controls.some(control => control.value === name);
      if (!instructorExists) {
        if(!this.onUpdate && instructorsFormArray.at(0).value === ''){
          instructorsFormArray.at(0).setValue(name);
        }
        else{
          instructorsFormArray.push(this.fb.control(name, [Validators.required, this.trimAndValidateFullName]));
        }
      }

      const emailsFormArray = this.labForm.get('allowed_emails') as FormArray;
      const emailExists = emailsFormArray.controls.some(control => control.value === user.email);
      if(!emailExists){
        emailsFormArray.push(this.fb.control(user.email, [Validators.required, Validators.email]));
      }
    });
  }

  trimAndValidateFullName(control: AbstractControl) {
    const value = control.value;
    if (typeof value === 'string') {
      const trimmedValue = value.trim();

      const pattern = /^([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ\.]{1,})(\s+([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ\.]{1,})){1,3}$/;

      return Validators.pattern(pattern)(new FormControl(trimmedValue));
    }
    return null;
  }

  getFullNameMessage(control: AbstractControl) {
    if (control.hasError('pattern')) {
      return 'Provide a full name separated by spaces (e.g., John Doe)';
    }
    return '';
  }
}
