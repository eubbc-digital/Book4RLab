import { Injectable } from '@angular/core';
import { Lab } from '../interfaces/lab';
import config from '../config.json';
import data from '../data.json';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  labs: Lab[] = [];

  constructor() {
    this.labs = this.getLabs();
  }

  getLabs(): Lab[] {
    return data.labs;
  }
}
