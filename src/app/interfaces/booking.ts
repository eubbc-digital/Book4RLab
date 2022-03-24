export interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  available: boolean;
  access_url?: string;
  user?: number;
  kit: number;
}
