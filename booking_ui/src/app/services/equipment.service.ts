/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private url: string = `${config.api.baseUrl}${config.api.equipments}`;

  constructor(private http: HttpClient) {}

  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.url);
  }

  getEquipmentsByLabId(labId: number): Observable<Equipment[]> {
    const params = new HttpParams().set('laboratory', labId);
    return this.http.get<Equipment[]>(this.url, { params });
  }

  getEquipmentById(equipmentId: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.url}${equipmentId}/`);
  }

  addEquipment(equipment: Equipment) {
    return this.http.post<Equipment>(this.url, equipment);
  }

  updateEquipment(newEquipment: Equipment, id: number) {
    return this.http.put<Equipment>(`${this.url}${id}/`, newEquipment);
  }
}
