/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Kit } from 'src/app/interfaces/kit';
import { KitService } from 'src/app/services/kit.service';

@Component({
  selector: 'app-kit-dialog',
  templateUrl: './kit-dialog.component.html',
  styleUrls: ['./kit-dialog.component.css'],
})
export class KitDialogComponent implements OnInit {
  title = 'Register kit';

  selectedKitId = 0;
  labId = 0;

  kitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: Kit,
    private dialogRef: MatDialogRef<KitDialogComponent>,
    private toastr: ToastrService,
    private kitService: KitService
  ) {}

  ngOnInit(): void {
    this.labId = this.dialogData.laboratory!;

    if (this.dialogData.id) {
      const kit = this.dialogData;

      this.selectedKitId = kit.id!;
      this.kitForm.controls['name'].setValue(kit.name!);
      this.kitForm.controls['description'].setValue(kit.description);

      this.title = 'Update kit';
    } else {
      this.title = 'Register kit';
    }
  }

  addKit(): void {
    const kit = this.getKit();

    this.kitService.addKit(kit).subscribe({
      next: (_) => {
        this.resetDialog('The kit has been created successfully.');
      },
      error: (e) => {
        this.toastr.error(
          'There was an error creating the kit. Please try later.'
        );
      },
    });
  }

  updateKit(): void {
    const kit = this.getKit();

    this.kitService.updateKit(kit, this.selectedKitId).subscribe({
      next: (_) => {
        this.resetDialog('The kit has been updated successfully.');
      },
      error: (e) => {
        this.toastr.error(
          'There was an error updating the kit. Please try later.'
        );
      },
    });
  }

  getKit(): Kit {
    const kit = this.kitForm.value;
    kit.laboratory = this.labId;

    return kit;
  }

  save(): void {
    if (this.kitForm.valid) {
      if (this.dialogData.id) this.updateKit();
      else this.addKit();
    } else {
      this.toastr.error('Please fill in correctly the data.');
    }
  }

  resetDialog(msg?: string) {
    if (msg) this.toastr.success(msg);
    this.kitForm.reset();
    this.dialogRef.close(msg);
  }
}
