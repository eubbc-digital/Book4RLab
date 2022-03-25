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
  @Output() selectedHourEvent = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  updateSelectedHour(): void {
    this.selectedHourEvent.emit(this.bookingId);
  }
}
