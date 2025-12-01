/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrCodeModule } from 'ng-qrcode';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { CookieService } from 'ngx-cookie-service';
import { YouTubePlayerModule } from '@angular/youtube-player';

// Components
import { AppComponent } from './app.component';
import { AvailableHoursComponent } from './components/available-hours/available-hours.component';
import { BookingLinkComponent } from './components/booking-link/booking-link.component';
import { CardElevationDirective } from './directives/card-elevation.directive';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationFormComponent } from './components/confirmation-form/confirmation-form.component';
import { EquipmentDialogComponent } from './components/equipment-dialog/equipment-dialog.component';
import { EquipmentsComponent } from './pages/equipments/equipments.component';
import { FooterComponent } from './components/footer/footer.component';
import { HelpButtonComponent } from './components/help-button/help-button.component';
import { HelpDialogComponent } from './components/help-dialog/help-dialog.component';
import { LabDialogComponent } from './components/lab-dialog/lab-dialog.component';
import { LabsComponent } from './pages/labs/labs.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReservationCardComponent } from './components/reservation-card/reservation-card.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TimeframeDialogComponent } from './components/timeframe-dialog/timeframe-dialog.component';
import { TimeframesComponent } from './pages/timeframes/timeframes.component';

// Pages
import { AccessComponent } from './pages/access/access.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { InstructorAccessRequestComponent } from './pages/instructor-access-request/instructor-access-request.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PrivateReservationsComponent } from './pages/private-reservations/private-reservations.component';
import { PublicReservationsComponent } from './pages/public-reservations/public-reservations.component';

// Interceptors
import { AuthInterceptorService } from './services/auth-interceptor.service';

// Guards
import { PendingChangesGuard } from './services/guards/pending-changes.guard';
import { LabGridComponent } from './pages/lab-grid/lab-grid.component';

// Pipes
import { FilterPipe } from './pipes/lab-filter.pipe';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { LabDescriptionComponent } from './pages/lab-description/lab-description.component';
import { CountdownModule } from 'ngx-countdown';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { LabStructureComponent } from './pages/lab-structure/lab-structure.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';

@NgModule({
  declarations: [
    AccessComponent,
    ActivationComponent,
    AppComponent,
    AvailableHoursComponent,
    BookingLinkComponent,
    BookingStepperComponent,
    CardElevationDirective,
    ConfirmationDialogComponent,
    ConfirmationFormComponent,
    EquipmentDialogComponent,
    EquipmentsComponent,
    FilterPipe,
    FooterComponent,
    HelpButtonComponent,
    HelpDialogComponent,
    InstructorAccessRequestComponent,
    LabDescriptionComponent,
    LabDialogComponent,
    LabGridComponent,
    LabStructureComponent,
    LabsComponent,
    LoginComponent,
    NavbarComponent,
    NotFoundComponent,
    PrivateReservationsComponent,
    ProfileComponent,
    ProfileFormComponent,
    PublicReservationsComponent,
    RegistrationComponent,
    ReservationCardComponent,
    ScrollToTopComponent,
    SpinnerComponent,
    TimeframeDialogComponent,
    TimeframesComponent,
    MainLayoutComponent,
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
    MatTooltipModule,
    NgHttpLoaderModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    YouTubePlayerModule
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    PendingChangesGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
