import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { LabHourService } from 'src/app/services/lab-hour.service';
import { LabHour } from 'src/app/interfaces/labHour';

@Component({
  selector: 'app-available-hours',
  templateUrl: './available-hours.component.html',
  styleUrls: ['./available-hours.component.css'],
})
export class AvailableHoursComponent implements OnInit {
  hours: LabHour[] = [];
  selectedHour: number = 0;

  @Output() selectedHourEvent = new EventEmitter<number>();

  constructor(private labHourService: LabHourService) {
    this.hours = this.labHourService.getLabHours();
  }

  ngOnInit(): void {}

  updateSelectedHour(): void {
    this.selectedHourEvent.emit(this.selectedHour);
  }
}
