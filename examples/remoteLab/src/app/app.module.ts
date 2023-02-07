import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { CountdownModule } from 'ngx-countdown';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpectralChartComponent } from './components/chart/spectral-chart.component';
import { ExperimentViewComponent } from './components/experiment-view/experiment-view.component';
import { CameraControllerComponent } from './components/camera-controller/camera-controller.component';
import { LightControllerComponent } from './components/light-controller/light-controller.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FooterComponent } from './components/footer/footer.component';
import { RowPreviewComponent } from './components/row-preview/row-preview.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { RemoteLabComponent } from './components/remote-lab/remote-lab.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AccessComponent } from './components/access/access.component';
import { ActuatorControllerComponent } from './components/actuator-controller/actuator-controller.component';
import { LobbyComponent } from './components/lobby/lobby.component';

// Interceptors
import { AuthInterceptorService } from './services/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SpectralChartComponent,
    ExperimentViewComponent,
    CameraControllerComponent,
    LightControllerComponent,
    DataTableComponent,
    FooterComponent,
    RowPreviewComponent,
    DeleteDialogComponent,
    LoginComponent,
    RemoteLabComponent,
    RegistrationComponent,
    AccessComponent,
    ActuatorControllerComponent,
    LobbyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    CountdownModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
