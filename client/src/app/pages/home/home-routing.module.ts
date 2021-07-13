import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './landing-page/home.component';
import { RestoreComponent } from './restore/restore.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'simulador', component: SimulatorComponent},
  {path: 'verificar', component: VerifyComponent},
  {path: 'restablecer', component: RestoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }