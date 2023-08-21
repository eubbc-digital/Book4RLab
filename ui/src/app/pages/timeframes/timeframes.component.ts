/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TimeframeDialogComponent } from 'src/app/components/timeframe-dialog/timeframe-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';

import { TimeframeService } from 'src/app/services/timeframe.service';
import { ToastrService } from 'ngx-toastr';

import { Timeframe } from 'src/app/interfaces/timeframe';
import { Equipment } from 'src/app/interfaces/equipment';
import { EquipmentService } from 'src/app/services/equipment.service';

@Component({
  selector: 'app-timeframes',
  templateUrl: './timeframes.component.html',
  styleUrls: ['./timeframes.component.css'],
})
export class TimeframesComponent implements OnInit {
  tableTitle = 'Timeframes assignment';

  isLoading = false;

  selectedTimeFrame?: Timeframe;
  selectedEquipment: Equipment = {};

  displayedColumns: string[] = [
    'id',
    'startDate',
    'endDate',
    'startHour',
    'endHour',
    'slotDuration',
    'actions',
  ];

  dataSource = new MatTableDataSource<Timeframe>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private timeframeService: TimeframeService,
    private equipmentService: EquipmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedEquipment.id = params['equipment'];

      this.equipmentService
        .getEquipmentById(this.selectedEquipment.id!)
        .subscribe((response) => (this.selectedEquipment = response));

      this.getTimeframesByEquipmentId();
    });
  }

  getTimeframesByEquipmentId(): void {
    if (this.selectedEquipment.id) {
      this.isLoading = true;

      this.timeframeService
        .getTimeframeByEquipmentId(this.selectedEquipment.id!)
        .subscribe((response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        });
    }
  }

  openTimeframeDialog(): void {
    if (!this.selectedTimeFrame)
      this.selectedTimeFrame = { equipment: this.selectedEquipment.id };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = this.selectedTimeFrame;

    const dialogRef = this.dialog.open(TimeframeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.getTimeframesByEquipmentId();
        this.selectedTimeFrame = undefined;
      }
    });
  }

  openDeleteDialog(id: number): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = {
      message: 'Are you sure you want to delete this timeframe?',
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((response) => {
      if (response && response.answer) {
        this.deleteTimeframe(id);
      }
    });
  }

  deleteTimeframe(id: number): void {
    this.timeframeService.deleteTimeframe(id).subscribe({
      next: (_) => {
        this.toastr.success('The timeframe has been deleted successfully.');
        this.getTimeframesByEquipmentId();
      },
      error: (e) => {
        this.toastr.error(
          'There was an error deleting the timeframe. Please try later.'
        );
      },
    });
  }

  getFormattedDate(date: string) {
    return new Date(date).toDateString();
  }

  convertUTCHourToLocalTime(hour: string): string {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(
      date.toLocaleDateString('en-US', { hour12: false }) + ' ' + hour
    );
    const utcTime = new Date(localTime.getTime() - timezoneOffset);
    return utcTime.toString().substring(16, 21);
  }
}
