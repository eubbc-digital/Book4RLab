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

import { KitService } from 'src/app/services/equipment.service';
import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';

import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { KitDialogComponent } from 'src/app/components/equipment-dialog/equipment-dialog.component';

import { Kit } from 'src/app/interfaces/equipment';
import { Lab } from 'src/app/interfaces/lab';

@Component({
  selector: 'app-kits',
  templateUrl: './kits.component.html',
  styleUrls: ['./kits.component.css'],
})
export class KitsComponent implements OnInit {
  tableTitle = 'Equipment assignment';

  isLoading = false;

  selectedKit?: Kit;
  selectedLab: Lab = {};

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  dataSource = new MatTableDataSource<Kit>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private kitService: KitService,
    private labService: LabService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedLab.id = params['lab'];

      this.labService
        .getLabById(this.selectedLab.id!)
        .subscribe((response) => (this.selectedLab = response));

      this.getKitsByLabId();
    });
  }

  goToAssignments(kitId: number): void {
    this.router.navigate(['/timeframes'], {
      queryParams: {
        kit: kitId,
      },
    });
  }

  getKitsByLabId(): void {
    if (this.selectedLab.id) {
      this.isLoading = true;

      this.kitService
        .getKitsByLabId(this.selectedLab.id)
        .subscribe((response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        });
    }
  }

  openKitDialog(): void {
    if (!this.selectedKit)
      this.selectedKit = { laboratory: this.selectedLab.id };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = this.selectedKit;

    const dialogRef = this.dialog.open(KitDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response) this.getKitsByLabId();
      this.selectedKit = undefined;
    });
  }

  openDeleteDialog(kit: Kit): void {
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
        this.deleteKit(kit);
      }
    });
  }

  updateKit(kit: Kit): void {
    this.selectedKit = kit;
    this.openKitDialog();
  }

  deleteKit(kit: Kit): void {
    kit.enabled = false;
    this.kitService.updateKit(kit, kit.id!).subscribe({
      next: (_) => {
        this.toastr.success('The equipment has been deleted successfully.');
        this.getKitsByLabId();
      },
      error: (e) => {
        this.toastr.error(
          'There was an error deleting the equipment. Please try later.'
        );
      },
    });
  }
}
