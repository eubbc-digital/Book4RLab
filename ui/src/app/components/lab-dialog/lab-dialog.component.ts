import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  labForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    url: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
      ),
    ]),
    description: new FormControl(''),
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
      this.labForm.controls['url'].setValue(lab.url!);
      this.labForm.controls['description'].setValue(lab.description);

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
}
