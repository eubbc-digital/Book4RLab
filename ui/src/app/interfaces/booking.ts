/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

export interface Booking {
  id: number;
  start_date?: string;
  end_date?: string;
  available: boolean;
  public: boolean;
  access_id?: string;
  password?: string;
  owner?: number | null;
  reserved_by?: { email: string; last_name: string; name: string } | null;
  kit?: number;
}
