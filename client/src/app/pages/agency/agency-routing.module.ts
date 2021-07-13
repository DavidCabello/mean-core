import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AgencyComponent } from './agency/agency.component';
import { InvitationComponent } from './invitation/invitation.component';


const routes: Routes = [
  {path: '', component: AgencyComponent, canActivate: [AuthGuard]},
  {path: 'invitacion', component: InvitationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyRoutingModule { }
