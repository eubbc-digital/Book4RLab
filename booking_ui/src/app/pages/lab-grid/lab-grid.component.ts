/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Component, OnInit } from '@angular/core';
import { Lab } from 'src/app/interfaces/lab';
import { PublicLabsService } from 'src/app/services/public-labs.service';
import { Router } from '@angular/router';
import { countries } from 'src/app/store/country-data-store';

@Component({
  selector: 'app-lab-grid',
  templateUrl: './lab-grid.component.html',
  styleUrls: ['./lab-grid.component.css'],
})
export class LabGridComponent implements OnInit {
  labsFiltered: Lab[] = [];
  labs: Lab[] = [];
  searchedLab = '';

  defaultLabImg = './assets/remote-lab.png';

  constructor(
    private publicLabsService: PublicLabsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.publicLabsService.getPublicLabs().subscribe((labs) => {
      this.labs = labs;
      this.labsFiltered = labs;
    });
  }

  selectLab(lab: Lab): void {
    this.router.navigate(['/booking', lab.id]);
  }

  moreInfoLab(lab: Lab): void {
    this.router.navigate(['/lab-structure', { id: lab.id }]);
  }

  getAvailableLabsCount(): number {
    return this.labs.filter(lab => lab.is_available_now).length;
  }

  getLabTypeCount(type: string): number {
    return this.labs.filter(lab => lab.type === type).length;
  }

  getAvailabilityTooltip(lab: Lab): string {
    if (lab.type === 'uc') {
      return 'Ultra Concurrent labs do not require booking slots.\nThey are always available for immediate access.';
    }

    if (lab.is_available_now === undefined) {
      return 'Availability status is currently unknown.';
    }
    if (lab.is_available_now) {
      return 'This lab has available time slots for booking.\nAvailability may change as others make reservations.';
    } else {
      return 'This lab is not available either because:\n- No booking slots were created\n- All existing slots are booked\n- The lab is currently in use';
    }
  }
 
  //New version
  getAvailabilityTooltip2(lab: Lab): string {
    const isAvailable = lab.is_available_now;
    const availabilityType = lab.availability_type;

    if (isAvailable === undefined) {
      return 'Availability status is currently unknown.';
    }
    
    if (isAvailable) {
      switch (availabilityType) {
        case 'bookable':
          return 'This lab has available time slots for booking.\nAvailability may change as others make reservations.';
        case 'demand':
          return 'This lab has available time slots for booking.\nHowever, it requires coordination with the lab manager before use.';
        case 'always':
          return 'This lab does not require booking slots.\nIt is always available for immediate access.';
        default:
          return 'Availability status is currently unknown.';
      }  
    }
    else {
      switch (availabilityType) {
        case 'bookable':
        case 'demand':
          return 'This lab is not available either because:\n- No booking slots were created\n- All existing slots are booked\n- The lab is currently in use';
        case 'development':
          return 'This lab is registered but not yet ready for use.';
        case 'unavailable':
          return 'This lab is temporarily or permanently unavailable.\nIt may be under maintenance or closed.';
        default:
          return 'Availability status is currently unknown.';
      }  
    }
  }

  getAvailabilityMessage(lab: Lab): string {
    const isAvailable = lab.is_available_now;
    const availabilityType = lab.availability_type;

    if (isAvailable === undefined) {
      return 'Unknown';
    }

    if (isAvailable) {
      switch (availabilityType) {
        case 'bookable':
          return 'Available for Booking';
        case 'demand':
          return 'Available on Demand';
        case 'always':
          return 'Always Available';
        default:
          return 'Unknown';
      }
    }
    else {
      if(availabilityType === 'development') {
        return 'Under Development';
      }
      return 'Not Available';
    }
  }

  getFullCountryName(lab: Lab): string {
    const country = countries.find(country => country.code === lab.country);
    return country?.name ?? 'Unknown Country';
  }

  onStatClick(type: string): void {
    switch (type) {
      case "available":
        this.labsFiltered = this.labs.filter(lab => lab.is_available_now);
        break;
      case "uc":
        this.labsFiltered = this.labs.filter(lab => lab.type === 'uc');
        break;
      case "rt":
        this.labsFiltered = this.labs.filter(lab => lab.type === 'rt');
        break;
      case "all":
        this.labsFiltered = this.labs;
        break;
      default:
        break;
    }
  }

  searchInputCLicked(): void {
    this.labsFiltered = this.labs;
  }
}
