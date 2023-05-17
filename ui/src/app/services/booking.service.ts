/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../config.json';
import { Booking } from '../interfaces/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private url: string = `${config.api.baseUrl}${config.api.booking.url}`;

  constructor(private http: HttpClient) {}

  getBookingListByKitId(kitId: number): Observable<Booking[]> {
    let params = new HttpParams().set('kit', kitId);

    return this.http.get<Booking[]>(this.url, { params });
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.url}${id}/`);
  }

  registerBooking(booking: Booking): Observable<Booking> {
    return this.http.patch<Booking>(
      `${this.url}${booking.id}/?register=true`,
      booking
    );
  }

  confirmBooking(booking: Booking): Observable<Booking> {
    return this.http.patch<Booking>(
      `${this.url}${booking.id}/?confirmed=true`,
      booking
    );
  }

  updateBooking(booking: Booking): Observable<Booking> {
    return this.http.patch<Booking>(`${this.url}${booking.id}/`, booking);
  }

  getPersonalBookingList(): Observable<Booking[]> {
    let url = `${config.api.baseUrl}${config.api.booking.myList}`;
    return this.http.get<Booking[]>(url);
  }

  getPublicReservations(
    kitId: number,
    startDate: string,
    endDate: string
  ): Observable<Booking[]> {
    let url = `${config.api.baseUrl}${config.api.booking.publicReservations}`;
    let params = new HttpParams();

    if (kitId != 0) params = params.append('kit', kitId);

    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);

    return this.http.get<Booking[]>(url, { params });
  }
}
