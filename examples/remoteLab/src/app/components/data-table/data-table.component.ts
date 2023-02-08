import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { RowPreviewComponent } from '../row-preview/row-preview.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {

  displayedColumns: string[] = [
  ];

  dateFormat: string = 'MMMM Do YYYY, h:mm:ss a';

  @ViewChild('noteTable') noteTable!: MatTable<any>;

  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  openPreviewDialog(item: any): void {
    console.log(item);
    this.dialog.open(RowPreviewComponent, {
      width: '40%',
      data: item,
    });
  }

  openDeleteDialog(spectraId: number): void {
    const deleteDialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '40%',
      data: {},
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result.confirmation) {
      }
    });
  }


  getImageSrc(image: number[]): string {
    return (
      'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, image))
    );
  }

  getFormattedDate(date: any): string {
    return moment(date).format(this.dateFormat);
  }
}
