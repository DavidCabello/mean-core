import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgencyRoutingModule } from './agency-routing.module';
import { AgencyComponent } from './agency/agency.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { InputLogoComponent } from './input-logo/input-logo.component';
import { MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { InvitationComponent } from './invitation/invitation.component';


@NgModule({
  declarations: [AgencyComponent, InputLogoComponent, InvitationComponent],
  imports: [
    CommonModule,
    AgencyRoutingModule,
    SharedModule,
    FormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class AgencyModule { }
