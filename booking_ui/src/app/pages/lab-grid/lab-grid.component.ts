/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lab } from 'src/app/interfaces/lab';
import { PublicLabsService } from 'src/app/services/public-labs.service';

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
}
