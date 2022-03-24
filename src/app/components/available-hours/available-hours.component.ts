import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-available-hours',
  templateUrl: './available-hours.component.html',
  styleUrls: ['./available-hours.component.css'],
})
export class AvailableHoursComponent implements OnInit {
  hours: [] = [];
  selectedHour: number = 0;

  @Output() selectedHourEvent = new EventEmitter<number>();

  constructor() {
    //this.hours = this.labHourService.getLabHours();
  }

  ngOnInit(): void {}

  updateSelectedHour(): void {
    this.selectedHourEvent.emit(this.selectedHour);
  }
}
