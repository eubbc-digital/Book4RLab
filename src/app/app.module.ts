import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrCodeModule } from 'ng-qrcode';

import { AppComponent } from './app.component';
import { BookingStepperComponent } from './components/booking-stepper/booking-stepper.component';
import { AvailableHoursComponent } from './components/available-hours/available-hours.component';
import { ConfirmationFormComponent } from './components/confirmation-form/confirmation-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BookingLinkComponent } from './components/booking-link/booking-link.component';

@NgModule({
  declarations: [AppComponent, BookingStepperComponent, AvailableHoursComponent, ConfirmationFormComponent, NavbarComponent, FooterComponent, BookingLinkComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    QrCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
