import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Login, User } from 'src/app/models/user';
import { MailerService } from 'src/app/services/mailer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User = new User()
  passwordVerification: string

  
  loggingIn: boolean = false
  signingUp: boolean = false
  sendingMail: boolean = false
  sendingVerification: boolean = false

  hideLoginPassword: boolean = true
  hideSignupPassword: boolean = true
  hideVerificationPassword: boolean = true
  
  loginError: boolean = false
  existingEmail: boolean = false
  verificationError: boolean = false

  openRecoverSuccess: ElementRef
  openVerify: ElementRef
  openError: ElementRef

  @ViewChild('closeRecover', {static: false}) closeRecover: ElementRef
  @ViewChild('openButton', {static: false}) openButton: ElementRef
  @ViewChild('base', {static: false}) base: ElementRef
  @ViewChild('closeBase', {static: false}) closeBase: ElementRef
  @ViewChild('openRecover', {static: false}) openRecover: ElementRef
  @ViewChild('openSendVerification', {static: false}) openSendVerification: ElementRef
  @ViewChild('closeSendVerification', {static: false}) closeSendVerification: ElementRef
  @ViewChild('openSended', {static: false}) openSended: ElementRef
  @ViewChild('sendVerificationModal', {static: false}) sendVerificationModal: ElementRef
  @ViewChild('recoverModal', {static: false}) recoverModal: ElementRef

  @Output() open = new EventEmitter<ElementRef>()

  @Input() showButton: boolean = true

  constructor(private userService: UserService,
              private mailerService: MailerService,
              private router: Router) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.open.emit(this.openButton)
    document.body.appendChild(this.base.nativeElement)
    document.body.appendChild(this.sendVerificationModal.nativeElement)
    document.body.appendChild(this.recoverModal.nativeElement)
  }

  ngOnDestroy() {
    document.body.removeChild(this.base.nativeElement)
    document.body.removeChild(this.sendVerificationModal.nativeElement)
    document.body.removeChild(this.recoverModal.nativeElement)
  }

  login() {
    this.loginError = false
    this.loggingIn = true
    this.userService.login(this.user).subscribe((response: Login) => {
      this.loggingIn = false
      if (response.message == 'invalid') {
        this.loginError = true
      } else if(response.message == 'unverified') {
        this.closeBase.nativeElement.click()
        this.openSendVerification.nativeElement.click()
      } else {
        localStorage.setItem('token', response.token);
        this.userService.logged().subscribe(user => {
          if(user != 'not logged in') this.userService.setUser(user)
        })
        this.closeBase.nativeElement.click()
        this.router.navigate(['/resumen'])
      }
    }, error => {
      console.log(error)
      this.loggingIn = false
    });
  }

  sendVerification() {
    this.sendingVerification = true
    this.mailerService.sendVerification(this.user.email).subscribe(res => {
      this.sendingVerification = false
      this.closeSendVerification.nativeElement.click()
      if(res = 'message sent') {
        this.user = new User()
        this.openSended.nativeElement.click()
      } else {
        this.openError.nativeElement.click()
        console.log(res)
      }
    })
  }

  signup() {
    if(this.user.password != this.passwordVerification) {
      this.verificationError = true
      return
    }
    this.verificationError = false
    this.signingUp = true
    this.userService.signup(this.user).subscribe((response: Login) => {
      if(response.message == 'success') {
        this.mailerService.sendVerification(response.user.email).subscribe(res => {
          this.signingUp = false
          this.closeBase.nativeElement.click()
          if(res = 'message sent') {
            this.user = new User()
            this.passwordVerification = ''
            this.openVerify.nativeElement.click()
          } else {
            this.openError.nativeElement.click()
            console.log(res)
          }
        })
      } else if(response.message == 'existing') {
        this.signingUp = false
        this.existingEmail = true
      } else {
        this.signingUp = false
        this.closeBase.nativeElement.click()
        this.openError.nativeElement.click()
        console.log(response.message)
      }
    }, error => {
      console.log(error)
      this.signingUp = false
    });
  }

  verifyPass() {
    if(!this.user.password.startsWith(this.passwordVerification)) this.verificationError = true
    else this.verificationError = false
  }

  reset() {
    this.sendingMail = true
    this.mailerService.reset(this.user.email).subscribe(response => {
      this.sendingMail = false
      if(response == 'sent') {
        this.closeRecover.nativeElement.click()
        this.openRecoverSuccess.nativeElement.click()
      }
    }, error => {
      this.sendingMail = false
    });
  }

  reload() {
    location.reload()
  }

  recoverPassword() {
    this.closeBase.nativeElement.click()
    this.openRecover.nativeElement.click()
  }

}
