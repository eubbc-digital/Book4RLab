import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import config from '../../config.json';
import { Observable } from 'rxjs';
import { Booking } from '../interfaces/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingAccessUrl = config.bookingAccessUrl;

  constructor(private http: HttpClient) {}

  getBookingInfo(accessId: string, password: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.bookingAccessUrl}?access_key=${accessId}&pwd=${password}`
    );
  }

}
