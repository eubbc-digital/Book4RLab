/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

import { EquipmentService } from 'src/app/services/equipment.service';
import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';

import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { EquipmentDialogComponent } from 'src/app/components/equipment-dialog/equipment-dialog.component';

import { Equipment } from 'src/app/interfaces/equipment';
import { Lab } from 'src/app/interfaces/lab';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.css'],
})
export class EquipmentsComponent implements OnInit {
  tableTitle = 'Equipment Assignment';

  isLoading = false;

  selectedEquipment?: Equipment;
  selectedLab: Lab = {};

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  dataSource = new MatTableDataSource<Equipment>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private EquipmentService: EquipmentService,
    private labService: LabService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedLab.id = params['lab'];

      this.labService
        .getLabById(this.selectedLab.id!)
        .subscribe((response) => (this.selectedLab = response));

      this.getEquipmentsByLabId();
    });
  }

  goToAssignments(equipmentId: number): void {
    this.router.navigate(['/timeframes'], {
      queryParams: {
        equipment: equipmentId,
      },
    });
  }

  getEquipmentsByLabId(): void {
    if (this.selectedLab.id) {
      this.isLoading = true;

      this.EquipmentService
        .getEquipmentsByLabId(this.selectedLab.id)
        .subscribe((response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        });
    }
  }

  openEquipmentDialog(): void {
    if (!this.selectedEquipment)
      this.selectedEquipment = { laboratory: this.selectedLab.id };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = this.selectedEquipment;

    const dialogRef = this.dialog.open(EquipmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response) this.getEquipmentsByLabId();
      this.selectedEquipment = undefined;
    });
  }

  openDeleteDialog(equipment: Equipment): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = {
      message: 'Are you sure you want to delete this equipment?',
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((response) => {
      if (response && response.answer) {
        this.deleteEquipment(equipment);
      }
    });
  }

  updateEquipment(equipment: Equipment): void {
    this.selectedEquipment = equipment;
    this.openEquipmentDialog();
  }

  deleteEquipment(equipment: Equipment): void {
    equipment.enabled = false;
    this.EquipmentService.updateEquipment(equipment, equipment.id!).subscribe({
      next: (_) => {
        this.toastr.success('The equipment has been deleted successfully.');
        this.getEquipmentsByLabId();
      },
      error: (e) => {
        this.toastr.error(
          'There was an error deleting the equipment. Please try later.'
        );
      },
    });
  }
}
