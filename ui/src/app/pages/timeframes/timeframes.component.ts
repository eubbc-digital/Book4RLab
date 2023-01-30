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
import { Kit } from 'src/app/interfaces/kit';
import { KitService } from 'src/app/services/kit.service';

@Component({
  selector: 'app-timeframes',
  templateUrl: './timeframes.component.html',
  styleUrls: ['./timeframes.component.css'],
})
export class TimeframesComponent implements OnInit {
  tableTitle = 'Timeframes assignment';

  isLoading = false;

  selectedTimeFrame?: Timeframe;
  selectedKit: Kit = {};

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
    private kitService: KitService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedKit.id = params['kit'];

      this.kitService
        .getKitById(this.selectedKit.id!)
        .subscribe((response) => (this.selectedKit = response));

      this.getTimeframesByKitId();
    });
  }

  getTimeframesByKitId(): void {
    if (this.selectedKit.id) {
      this.isLoading = true;

      this.timeframeService
        .getTimeframeByKitId(this.selectedKit.id!)
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
      this.selectedTimeFrame = { kit: this.selectedKit.id };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = this.selectedTimeFrame;

    const dialogRef = this.dialog.open(TimeframeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.getTimeframesByKitId();
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
        this.getTimeframesByKitId();
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

  getFormattedHour(hour: string) {
    return hour.slice(0, -3);
  }
}
