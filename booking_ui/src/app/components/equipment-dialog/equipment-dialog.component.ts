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
import { Equipment } from 'src/app/interfaces/equipment';
import { EquipmentService } from 'src/app/services/equipment.service';

@Component({
  selector: 'app-equipment-dialog',
  templateUrl: './equipment-dialog.component.html',
  styleUrls: ['./equipment-dialog.component.css'],
})
export class EquipmentDialogComponent implements OnInit {
  title = 'Register Equipment';

  selectedEquipmentId = 0;
  labId = 0;

  equipmentForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
    bookings_per_user: new UntypedFormControl(3, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: Equipment,
    private dialogRef: MatDialogRef<EquipmentDialogComponent>,
    private toastr: ToastrService,
    private equipmentService: EquipmentService
  ) { }

  ngOnInit(): void {
    this.labId = this.dialogData.laboratory!;

    if (this.dialogData.id) {
      const equipment = this.dialogData;

      this.selectedEquipmentId = equipment.id!;
      this.equipmentForm.controls['name'].setValue(equipment.name!);
      this.equipmentForm.controls['description'].setValue(equipment.description);
      this.equipmentForm.controls['bookings_per_user'].setValue(equipment.bookings_per_user);

      this.title = 'Update Equipment';
    } else {
      this.title = 'Register Equipment';
    }
  }

  addEquipment(): void {
    const equipment = this.getEquipment();

    this.equipmentService.addEquipment(equipment).subscribe({
      next: (_) => {
        this.resetDialog('The equipment has been created successfully.');
      },
      error: (e) => {
        this.toastr.error(
          'There was an error creating the equipment. Please try later.'
        );
      },
    });
  }

  updateEquipment(): void {
    const equipment = this.getEquipment();

    this.equipmentService.updateEquipment(equipment, this.selectedEquipmentId).subscribe({
      next: (_) => {
        this.resetDialog('The equipment has been updated successfully.');
      },
      error: (e) => {
        this.toastr.error(
          'There was an error updating the equipment. Please try later.'
        );
      },
    });
  }

  getEquipment(): Equipment {
    const equipment = this.equipmentForm.value;
    equipment.laboratory = this.labId;

    return equipment;
  }

  save(): void {
    if (this.equipmentForm.valid) {
      if (this.dialogData.id) this.updateEquipment();
      else this.addEquipment();
    } else {
      this.toastr.error('Please fill in correctly the data.');
    }
  }

  resetDialog(msg?: string) {
    if (msg) this.toastr.success(msg);
    this.equipmentForm.reset();
    this.dialogRef.close(msg);
  }
}
