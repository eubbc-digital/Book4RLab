import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';

import { LabDialogComponent } from 'src/app/components/lab-dialog/lab-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';

import { Lab } from 'src/app/interfaces/lab';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.css'],
})
export class LabsComponent implements OnInit {
  tableTitle = 'Labs';

  isLoading = false;

  selectedLab?: Lab;

  displayedColumns: string[] = ['id', 'name', 'url', 'actions'];

  dataSource = new MatTableDataSource<Lab>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private labService: LabService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getLabs();
  }

  goToAssignments(labId: number): void {
    this.router.navigate(['/kit-assignment'], {
      queryParams: {
        lab: labId,
      },
    });
  }

  getLabs(): void {
    this.isLoading = true;
    this.labService.getLabs().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  openLabDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = this.selectedLab;

    const dialogRef = this.dialog.open(LabDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.getLabs();
        this.selectedLab = undefined;
      }
    });
  }

  openDeleteDialog(lab: Lab): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = {
      message: 'Are you sure you want to delete this lab?',
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((response) => {
      if (response && response.answer) {
        this.deleteLab(lab);
      }
    });
  }

  updateLab(lab: Lab): void {
    this.selectedLab = lab;
    this.openLabDialog();
  }

  deleteLab(lab: Lab): void {
    lab.enabled = false;
    this.labService.updateLab(lab, lab.id!).subscribe({
      next: (_) => {
        this.toastr.success('The lab has been deleted successfully.');
        this.getLabs();
      },
      error: (e) => {
        this.toastr.error(
          'There was an error deleting the lab. Please try later.'
        );
      },
    });
  }
}
