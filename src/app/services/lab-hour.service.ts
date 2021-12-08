import { Injectable } from '@angular/core';
import { LabHour } from '../interfaces/labHour';
import data from '../data.json';

@Injectable({
  providedIn: 'root'
})
export class LabHourService {
  constructor() { }

  getLabHours() : LabHour[] {
    return data.hours;
  }
}
