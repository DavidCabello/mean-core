import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

//PAGES
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';

//SNIPPETS
import { HeaderComponent } from './snippets/header/header.component';
import { MenuComponent } from './snippets/menu/menu.component';
import { FooterComponent } from './snippets/footer/footer.component';

//SERVICES
import { UserService } from './services/user.service';
import { MailerService } from './services/mailer.service';
import { FileService } from './services/file.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { LoginComponent } from './pages/login/login.component';
import { ModalComponent } from './snippets/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    FooterComponent,
    MenuComponent,
    HeaderComponent,
    ProfileComponent,
    LoginComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    UserService,
    MailerService,
    FileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
