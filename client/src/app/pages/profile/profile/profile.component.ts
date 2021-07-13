import { Component, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material';
import { MailerService } from 'src/app/services/mailer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  user = new User();
  userEmail: string = ''
  emailChanged: boolean = false
  userPro: boolean = false
  password: string = ''
  newPassword: string = ''
  verification: string = ''

  hidePassword: boolean = true
  hideNewPassword: boolean = true
  hideVerificationPassword: boolean = true

  verificationError: boolean = false
  authError: boolean = false
  existingEmail: boolean = false

  updating: boolean = false
  updatingPassword: boolean = false

  openMailChanged: ElementRef

  table = ['Opinión de valor ilimitadas', 'Cálculo de impuestos vendedor (ISR) ilimitados', 'Cálculo de impuestos comprador ilimitados', 'Reporte de estadísticos de asesores', 'Reporte de estadísticos de inmuebles', 'Descuento en servicios complementarios', 'Capacitaciones']

  constructor(public userService: UserService,
              private router: Router,
              private snackbar: MatSnackBar,
              private mailer: MailerService) { }

  ngOnInit() {
    this.userService.user.subscribe(user => {
      this.user = user || this.user
      if(user) this.userEmail = user.email
      const now = new Date()
      const expiration = new Date(this.user.pro_expiration)
      if(expiration.getTime() > now.getTime()) this.userPro = true
    })
  }

  update() {
    this.updating = true
    this.userService.update(this.user).subscribe((updated: any) => {
      this.updating = false
      if(updated == 'existing') {
        this.existingEmail = true
      } else {
        this.user = updated
        this.snackbar.open('Datos del perfil actualizados', '', {duration: 4000})
        if(this.emailChanged) {
          this.updating = true
          this.mailer.sendVerification(updated.email).subscribe(res => {
            this.updating = false
            this.openMailChanged.nativeElement.click()
          })
        }
      }
    })
  }

  updatePassword(form) {
    if(this.newPassword != this.verification) {
      this.verificationError = true
      return
    }
    this.updatingPassword = true
    this.userService.updatePassword(this.user._id, this.password, this.newPassword).subscribe((res: any) => {
      this.updatingPassword = false
      if(res.message == 'success') {
        this.user = res.user
        form.reset()
        this.snackbar.open('Contraseña actualizada', '', {duration: 4000})
      }
      else if(res.message == 'invalid') this.authError = true
    })
  }

  logout() {
    this.userService.logout()
  }

  verifyPass() {
    if(!this.newPassword.startsWith(this.verification)) this.verificationError = true
    else this.verificationError = false
  }

  checkEmail() {
    this.emailChanged = this.user.email != this.userEmail
    this.existingEmail = false
  }

}
