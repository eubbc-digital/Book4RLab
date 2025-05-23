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
    });
  }

  selectLab(lab: Lab): void {
    this.router.navigate(['/booking', lab.id]);
  }

  moreInfoLab(lab: Lab): void {
    this.router.navigate(['/lab-structure', { id: lab.id }]);
  }

  getAvailableLabsCount(): number {
    return this.labs.filter(lab => lab.is_available_now || lab.type === 'uc').length;
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

  getFullCountryName(lab: Lab): string {
    const country = countries.find(country => country.code === lab.country);
    return country?.name ?? 'Unknown Country';
  }

  getLabTypeToolTip(lab: Lab): string {
    switch (lab.type) {
      case 'rt': return 'A real-time lab grants exclusive live interaction with lab equipment after booking.';
      case 'uc': return 'An ultraconcurrent lab allows instant access for multiple simultaneous users.';
      default: return 'Unknown Lab Type';
    }
  }
}
