export interface Booking {
  id: number;
  start_date?: string;
  end_date?: string;
  available: boolean;
  public: boolean;
  access_id?: string;
  password?: string;
  owner?: number;
  reserved_by?: number | null;
  kit?: number;
}
