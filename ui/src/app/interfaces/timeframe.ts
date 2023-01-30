/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

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
