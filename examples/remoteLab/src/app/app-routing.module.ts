import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RemoteLabComponent } from './components/remote-lab/remote-lab.component';
import { AccessComponent } from './components/access/access.component';
import { LobbyComponent } from './components/lobby/lobby.component';

const routes: Routes = [
  {
    path: '',
    component: RemoteLabComponent,
  },
  {
    path: 'access',
    component: AccessComponent,
  },
  {
    path: 'lobby',
    component: LobbyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
