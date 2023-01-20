import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { AvailableDate } from 'src/app/interfaces/available-date';

@Component({
  selector: 'app-available-hours',
  templateUrl: './available-hours.component.html',
  styleUrls: ['./available-hours.component.css'],
})
export class AvailableHoursComponent implements OnInit {
  bookingId: number = 0;

  @Input() hours: AvailableDate[] = [];
  @Input() showSpinner: boolean = true;

  @Output() selectedHourEvent = new EventEmitter<number>();
  @Output() unavailableHoursEvent = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.hours.length == 0) {
      this.unavailableHoursEvent.emit();
      this.bookingId = 0;
    }
  }

  updateSelectedHour(): void {
    this.selectedHourEvent.emit(this.bookingId);
  }
}
