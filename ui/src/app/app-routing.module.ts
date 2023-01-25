import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from './pending-changes.guard';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { AccessComponent } from './pages/access/access.component';
import { PrivateReservationsComponent } from './pages/private-reservations/private-reservations.component';
import { PublicReservationsComponent } from './pages/public-reservations/public-reservations.component';

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
