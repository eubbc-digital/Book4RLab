import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-available-hours',
  templateUrl: './available-hours.component.html',
  styleUrls: ['./available-hours.component.css'],
})
export class AvailableHoursComponent implements OnInit {
  toggleOptions: Array<string> = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '13:00 PM',
    '14:00 PM',
    '15:00 PM',
    '16:00 PM',
    '17:00 PM',
    '18:00 PM',
    '19:00 PM',
    '20:00 PM',
    '21:00 PM',
    '22:00 PM',
  ];
  selectedValue: string = '12:00 PM';

  constructor() {}

  ngOnInit(): void {}
}
