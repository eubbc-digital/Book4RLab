﻿/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from './services/guards/pending-changes.guard';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { AccessComponent } from './pages/access/access.component';
import { PrivateReservationsComponent } from './pages/private-reservations/private-reservations.component';
import { PublicReservationsComponent } from './pages/public-reservations/public-reservations.component';
import { LabsComponent } from './pages/labs/labs.component';
import { KitsComponent } from './pages/kits/kits.component';
import { TimeframesComponent } from './pages/timeframes/timeframes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LabGridComponent } from './pages/lab-grid/lab-grid.component';
import { LabsGuard } from './services/guards/labs.guard';

const routes: Routes = [
  {
    path: 'lab-grid',
    component: LabGridComponent,
  },
  {
    path: 'booking/:id',
    component: BookingStepperComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'access',
    component: AccessComponent,
  },
  { path: '', redirectTo: '/lab-grid', pathMatch: 'full' },
  {
    path: 'my-reservations',
    component: PrivateReservationsComponent,
  },
  {
    path: 'public-reservations',
    component: PublicReservationsComponent,
  },
  {
    path: 'labs',
    component: LabsComponent,
    canActivate: [LabsGuard],
  },
  {
    path: 'kits',
    component: KitsComponent,
  },
  {
    path: 'timeframes',
    component: TimeframesComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
