export interface Timeframe {
  id?: number;
  start_date?: Date;
  end_date?: Date;
  start_hour?: string;
  end_hour?: string;
  slot_duration?: string;
  kit?: number;
  enabled?: boolean;
}
