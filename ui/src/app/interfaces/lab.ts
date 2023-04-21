/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

export interface Lab {
  id?: number;
  name?: string;
  instructor?: string;
  university?: string;
  course?: string;
  image?: string;
  description?: string;
  url?: string;
  enabled?: boolean;
}
