export interface AvailableDate {
  formattedDate: string;
  hour: {
    bookingId: number;
    formattedStartHour: string;
    formattedEndHour: string;
  };
}
