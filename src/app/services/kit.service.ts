import { Injectable } from '@angular/core';
import { Kit } from '../interfaces/kit';
import data from '../data.json';

@Injectable({
  providedIn: 'root',
})
export class KitService {
  constructor() {}

  getKits(): Kit[] {
    return data.materials;
  }
}
