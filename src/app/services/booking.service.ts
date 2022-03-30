import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../config.json';
import { Booking } from '../interfaces/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private url: string = `${config.api.baseUrl}${config.api.booking}`;

  constructor(private http: HttpClient) {}

  getBookingListByKitId(kitId: number): Observable<Booking[]> {
    let params = new HttpParams().set('kit', kitId);

    return this.http.get<Booking[]>(this.url, { params });
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.url}${id}/`);
  }

  registerBooking(booking: Booking): Observable<Booking> {
    return this.http.patch<Booking>(`${this.url}${booking.id}/?register=true`, booking);
  }

  updateBooking(booking: Booking): Observable<Booking> {
    return this.http.patch<Booking>(`${this.url}${booking.id}/`, booking);
  }

  getPersonalBookingList() : Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.url}me/`);
  }
}
