import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from './pending-changes.guard';
import { BookingStepperComponent } from './components/booking-stepper/booking-stepper.component';
import { AccessComponent } from './components/access/access.component';
import { PrivateReservationsComponent } from './components/private-reservations/private-reservations.component';
import { PublicReservationsComponent } from './components/public-reservations/public-reservations.component';

const routes: Routes = [
  {
    path: '',
    component: BookingStepperComponent,
    canDeactivate: [PendingChangesGuard]
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
