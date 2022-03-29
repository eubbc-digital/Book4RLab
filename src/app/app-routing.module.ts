import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingStepperComponent } from './components/booking-stepper/booking-stepper.component';
import { AccessComponent } from './components/access/access.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';

const routes: Routes = [
  { path: '', component: BookingStepperComponent },
  { path: 'access', component: AccessComponent },
  {
    path: 'reservation-list',
    component: ReservationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
