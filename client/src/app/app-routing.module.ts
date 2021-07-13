import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//GUARDS
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'resumen',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'inmobiliaria',
    loadChildren: () => import('./pages/agency/agency.module').then(m => m.AgencyModule)
  },
  {
    path: 'tareas',
    loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksModule)
  },
  // {path: '', component: HomeComponent},
  // {path: 'login', component: LoginComponent},
  // {path: 'signup', component: RegisterComponent},
  // {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
