import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
})
export class DeleteDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  deleteConfirmation(): void {
    this.dialogRef.close({ confirmation: true });
  }
}
