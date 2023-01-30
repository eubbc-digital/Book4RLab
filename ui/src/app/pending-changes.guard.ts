/*
* Copyright (c) Universidad Privada Boliviana (UPB) - EUBBC-Digital
* Adriana Orellana, Angel Zenteno, Alex Villazon, Omar Ormachea
* MIT License - See LICENSE file in the root directory
*/

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class PendingChangesGuard
  implements CanDeactivate<ComponentCanDeactivate>
{
  canDeactivate(
    component: ComponentCanDeactivate
  ): boolean | Observable<boolean> {
    if (component.canDeactivate()) {
      return true;
    } else {
      return false;
    }
  }
}
