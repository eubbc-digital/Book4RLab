import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.css']
})
export class HelpDialogComponent {
  contactEmail = 'upbremotelabs@gmail.com';
  appDescription = `Book4RLab, the EEDA Remote Lab Booking System, provides a secure and flexible interface for
  managing individual slot reservations, enabling learners worldwide to reserve optimal time slots for their
  laboratory sessions. The system ensures an authentic and uninterrupted hands-on experience, overcoming the
  limitations of current remote lab systems and fostering global collaboration across different institutions,
  countries, and time zones.`;

  constructor(public dialogRef: MatDialogRef<HelpDialogComponent>) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
