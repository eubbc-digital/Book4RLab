/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timeframe } from '../interfaces/timeframe';
import config from '../config.json';

@Injectable({
  providedIn: 'root',
})
export class TimeframeService {
  private url: string = `${config.api.baseUrl}${config.api.timeframes}`;

  constructor(private http: HttpClient) {}

  getTimeframes(): Observable<Timeframe[]> {
    return this.http.get<Timeframe[]>(this.url);
  }

  getTimeframeByEquipmentId(id: number): Observable<Timeframe[]> {
    const params = new HttpParams().set('equipment', id);
    return this.http.get<Timeframe[]>(this.url, { params });
  }

  getTimeframeById(id: number): Observable<Timeframe> {
    return this.http.get<Timeframe>(`${this.url}${id}/`);
  }

  addTimeframe(timeframe: Timeframe) {
    return this.http.post<Timeframe>(this.url, timeframe);
  }

  updateTimeframe(newTimeframe: Timeframe, id: number) {
    return this.http.put<Timeframe>(`${this.url}${id}/`, newTimeframe);
  }

  deleteTimeframe(id: number) {
    return this.http.delete<any>(`${this.url}${id}/`);
  }
}
