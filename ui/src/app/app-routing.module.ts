/*
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
import { EquipmentsComponent } from './pages/equipments/equipments.component';
import { TimeframesComponent } from './pages/timeframes/timeframes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LabGridComponent } from './pages/lab-grid/lab-grid.component';
import { LabsGuard } from './services/guards/labs.guard';
import { AuthGuard } from './services/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { LabDescriptionComponent } from './pages/lab-description/lab-description.component';

const routes: Routes = [
  {
    path: 'labs',
    component: LabGridComponent,
  },
  { path: 'lab-description', 
   component: LabDescriptionComponent,
   canActivate: [LabsGuard],
   },
  {
    path: 'booking/:id',
    component: BookingStepperComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'access',
    component: AccessComponent,
    canActivate: [AuthGuard],
  },
  { path: 'activate', component: ActivationComponent },
  { path: '', redirectTo: '/labs', pathMatch: 'full' },
  {
    path: 'my-reservations',
    component: PrivateReservationsComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'public-reservations',
    component: PublicReservationsComponent,
  },
  {
    path: 'my-labs',
    component: LabsComponent,
    canActivate: [LabsGuard],
  },
  {
    path: 'equipments',
    component: EquipmentsComponent,
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
