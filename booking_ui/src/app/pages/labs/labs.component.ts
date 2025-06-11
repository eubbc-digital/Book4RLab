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

import { LabService } from 'src/app/services/lab.service';
import { ToastrService } from 'ngx-toastr';

import { LabDialogComponent } from 'src/app/components/lab-dialog/lab-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';

import { Lab } from 'src/app/interfaces/lab';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.css'],
})
export class LabsComponent implements OnInit {
  tableTitle = 'Laboratories';

  userId!: number;

  selectedLab?: Lab;

  displayedColumns: string[] = ['id', 'name', 'url', 'actions'];

  dataSource = new MatTableDataSource<Lab>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private labService: LabService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userService.getUserData().subscribe((user) => {
      this.userId = user.id!;
      this.getLabs(this.userId);
    });
  }

  goToAssignments(labId: number): void {
    this.router.navigate(['/equipments'], {
      queryParams: {
        lab: labId,
      },
    });
  }

  getLabs(owner: number): void {
    this.labService.getLabs(owner).subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Set the initial sort configuration
      this.sort.active = 'id';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit({ active: 'id', direction: 'asc' });
    });
  }

  openLabDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['dialog-responsive', 'lab-dialog'];
    dialogConfig.data = this.selectedLab;
    const dialogRef = this.dialog.open(LabDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response) => {
      if (response == "lab-description") {
        this.router.navigate(["/lab-description"]);
      }
      else if (response) this.getLabs(this.userId);
      this.selectedLab = undefined;
    });
  }

  openDeleteDialog(lab: Lab): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-responsive';
    dialogConfig.data = {
      message: 'Are you sure you want to delete this laboratory?',
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
    this.labService.deleteLab(lab).subscribe({
      next: (_) => {
        this.toastr.success('The lab has been deleted successfully.');
        this.getLabs(this.userId);
      },
      error: (e) => {
        this.toastr.error(
          'There was an error deleting the lab. Please try later.'
        );
      },
    });
  }
}
