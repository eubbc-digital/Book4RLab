/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

export interface Lab {
  id?: number;
  name?: string;
  instructor?: string | string[];
  university?: string;
  university_abbreviation?: string;
  project_tag?: string;
  course?: string;
  image?: any;
  description?: string;
  url?: string;
  enabled?: boolean;
  visible?: boolean;
  is_available_now?: boolean;
  notify_owner?: boolean;
  allowed_emails?: string[];
  type?: string;
  availability_type?: string;
  country?: string;
  has_learnify_modules?: boolean;
}
