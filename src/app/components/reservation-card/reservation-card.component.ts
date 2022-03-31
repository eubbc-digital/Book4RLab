import { Component, Input, OnInit } from '@angular/core';
import { Booking } from 'src/app/interfaces/booking';
import { Kit } from 'src/app/interfaces/kit';
import { Lab } from 'src/app/interfaces/lab';
import { KitService } from 'src/app/services/kit.service';
import { LabService } from 'src/app/services/lab.service';
import * as moment from 'moment';
import config from '../../config.json';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.css'],
})
export class ReservationCardComponent implements OnInit {
  @Input() reservation!: Booking;
  @Input() privateList: boolean = false;

  kit!: Kit;
  lab!: Lab;

  dataReady: boolean = false;

  dateTimeFormat: string = 'MMMM Do YYYY, h:mm:ss a';

  constructor(private kitService: KitService, private labService: LabService) {}

  ngOnInit(): void {
    if (this.reservation !== null) this.getKit();
  }

  getAccessUrl(): string {
    let privateUrl = `${config.remoteLabUrl}${this.reservation.access_id}`;
    return this.privateList
      ? privateUrl
      : `${privateUrl}/pwd=${this.reservation.password}`;
  }

  getKit(): void {
    this.kitService.getKitById(this.reservation.kit!).subscribe((kit) => {
      this.kit = kit;
      this.getLab(this.kit.laboratory!);
    });
  }

  getLab(labId: number): void {
    this.labService.getLabById(labId).subscribe((lab) => {
      this.lab = lab;
      this.dataReady = true;
    });
  }

  getReservationType(): string {
    return this.reservation.public ? 'Public' : 'Private';
  }

  getFormattedDate(date: string): string {
    return moment(date).format(this.dateTimeFormat);
  }
}
