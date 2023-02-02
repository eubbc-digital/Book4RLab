/*
 * Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
 * Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
 * MIT License - See LICENSE file in the root directory
 */

export interface User {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  groups?: { name: string }[];
  last_name?: string;
  token?: string;
  country?: string;
}
