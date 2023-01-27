import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from './pending-changes.guard';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { AccessComponent } from './pages/access/access.component';
import { PrivateReservationsComponent } from './pages/private-reservations/private-reservations.component';
import { PublicReservationsComponent } from './pages/public-reservations/public-reservations.component';
import { LabsComponent } from './pages/labs/labs.component';
import { KitsComponent } from './pages/kits/kits.component';
import { TimeframesComponent } from './pages/timeframes/timeframes.component';

const routes: Routes = [
  {
    path: '',
    component: BookingStepperComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'access',
    component: AccessComponent,
  },
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
  },
  {
    path: 'kits',
    component: KitsComponent,
  },
  {
    path: 'timeframes',
    component: TimeframesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
