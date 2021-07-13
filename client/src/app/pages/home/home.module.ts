import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MatIconModule, MatInputModule } from '@angular/material';

//PAGES
import { HomeComponent } from './landing-page/home.component';
import { SimulatorComponent } from './simulator/simulator.component';

//COMPONENTS
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { RestoreComponent } from './restore/restore.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    SimulatorComponent,
    LoginComponent,
    VerifyComponent,
    RestoreComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HomeRoutingModule,
    MatInputModule,
    MatIconModule
  ]
})
export class HomeModule { }
