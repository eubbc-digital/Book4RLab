/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

export interface AvailableDate {
  formattedDate: string;
  hour: {
    bookingId: number;
    formattedStartHour: string;
    formattedEndHour: string;
  };
}
