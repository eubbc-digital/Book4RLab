export interface Booking {
  id: number;
  start_date?: string;
  end_date?: string;
  available: boolean;
  public: boolean;
  access_id?: string;
  password?: string;
  owner?: number;
  reserved_by?: { email: string; last_name: string; name: string } | null;
  kit?: number;
}
