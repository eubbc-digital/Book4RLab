import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrCodeModule } from 'ng-qrcode';
import { CountdownModule } from 'ngx-countdown';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { AvailableHoursComponent } from './components/available-hours/available-hours.component';
import { ConfirmationFormComponent } from './components/confirmation-form/confirmation-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BookingLinkComponent } from './components/booking-link/booking-link.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { CardElevationDirective } from './directives/card-elevation.directive';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

// Pages
import { AccessComponent } from './pages/access/access.component';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { PrivateReservationsComponent } from './pages/private-reservations/private-reservations.component';
import { PublicReservationsComponent } from './pages/public-reservations/public-reservations.component';

// Interceptors
import { AuthInterceptorService } from './services/auth-interceptor.service';

// Guards
import { PendingChangesGuard } from './pending-changes.guard';
import { LabsComponent } from './pages/labs/labs.component';
import { LabDialogComponent } from './components/lab-dialog/lab-dialog.component';
import { KitsComponent } from './pages/kits/kits.component';
import { KitDialogComponent } from './components/kit-dialog/kit-dialog.component';
import { TimeframesComponent } from './pages/timeframes/timeframes.component';
import { TimeframeDialogComponent } from './components/timeframe-dialog/timeframe-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BookingStepperComponent,
    AvailableHoursComponent,
    ConfirmationFormComponent,
    NavbarComponent,
    FooterComponent,
    BookingLinkComponent,
    LoginComponent,
    RegistrationComponent,
    AccessComponent,
    ReservationCardComponent,
    PrivateReservationsComponent,
    PublicReservationsComponent,
    CardElevationDirective,
    SpinnerComponent,
    ConfirmationDialogComponent,
    ScrollToTopComponent,
    LabsComponent,
    LabDialogComponent,
    KitsComponent,
    KitDialogComponent,
    TimeframesComponent,
    TimeframeDialogComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QrCodeModule,
    CountdownModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      preventDuplicates: true,
      progressBar: true,
    }),
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    PendingChangesGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
