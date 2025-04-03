/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { AccessComponent } from './pages/access/access.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { AuthGuard } from './services/guards/auth.guard';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { EquipmentsComponent } from './pages/equipments/equipments.component';
import { InstructorAccessRequestComponent } from './pages/instructor-access-request/instructor-access-request.component';
import { LabGridComponent } from './pages/lab-grid/lab-grid.component';
import { LabStructureComponent } from './pages/lab-structure/lab-structure.component';
import { LabsComponent } from './pages/labs/labs.component';
import { LabsGuard } from './services/guards/labs.guard';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PendingChangesGuard } from './services/guards/pending-changes.guard';
import { PrivateReservationsComponent } from './pages/private-reservations/private-reservations.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PublicReservationsComponent } from './pages/public-reservations/public-reservations.component';
import { RouterModule, Routes } from '@angular/router';
import { TimeframesComponent } from './pages/timeframes/timeframes.component';

const routes: Routes = [
  {
    path: 'labs',
    component: LabGridComponent,
  },
  {
    path: 'lab-structure',
    component: LabStructureComponent,
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
    path: 'instructor-access',
    component: InstructorAccessRequestComponent,
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
export class AppRoutingModule { }
