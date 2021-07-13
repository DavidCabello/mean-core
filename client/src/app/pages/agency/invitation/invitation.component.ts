import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Agency } from 'src/app/models/agency';
import { Invitation } from 'src/app/models/invitation';
import { Login, User } from 'src/app/models/user';
import { AgencyService } from 'src/app/services/agency.service';
import { InvitationService } from 'src/app/services/invitation.service';
import { MailerService } from 'src/app/services/mailer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {

  userLoaded: boolean = false
  agencyLoaded: boolean = false
  loggingIn: boolean = false
  signingUp: boolean = false
  sendingVerification: boolean = false
  sendingMail: boolean = false
  acceptLoading: boolean = false
  rejectLoading: boolean = false

  user: User = new User()
  passwordVerification: string = ''
  agency: Agency = new Agency()
  invitation: Invitation = new Invitation()

  existing: boolean = false

  hideLoginPassword: boolean = true
  hideSignupPassword: boolean = true
  hideVerificationPassword: boolean = true

  loginError: boolean = false
  verificationError: boolean = false

  openRecoverSuccess: ElementRef
  openVerify: ElementRef
  openError: ElementRef

  @ViewChild('closeRecover', {static: false}) closeRecover: ElementRef
  @ViewChild('openRecover', {static: false}) openRecover: ElementRef
  @ViewChild('openSendVerification', {static: false}) openSendVerification: ElementRef
  @ViewChild('closeSendVerification', {static: false}) closeSendVerification: ElementRef
  @ViewChild('openSended', {static: false}) openSended: ElementRef
  @ViewChild('sendVerificationModal', {static: false}) sendVerificationModal: ElementRef
  @ViewChild('recoverModal', {static: false}) recoverModal: ElementRef

  constructor(private users: UserService,
              private agencies: AgencyService,
              private invitations: InvitationService,
              private route: ActivatedRoute,
              private router: Router,
              private mailer: MailerService) { }

  ngOnInit() {
    this.users.logged().subscribe((res: any) => {
      if(res != 'not logged in') this.user = res
      this.userLoaded = true
    })
    this.route.queryParams.subscribe(params => {
      if(params.encoded) this.invitations.decode(params.encoded).subscribe((res: any) => {
        if(res == 'expired') this.goHome()
        else {
          this.invitation = res
          this.agencies.one(this.invitation.agency_id).subscribe((res: any) => {
            if(res) this.agency = res
            this.agencyLoaded = true
          })
        }
      })
      else this.goHome()
    })
  }

  goHome() {
    this.router.navigate(['/'])
  }

  login() {
    this.loginError = false
    this.loggingIn = true
    const user = {
      email: this.invitation.email,
      password: this.user.password
    }
    this.users.login(user).subscribe((response: Login) => {
      this.loggingIn = false
      if (response.message == 'invalid') {
        this.loginError = true
      } else if(response.message == 'unverified') {
        this.openSendVerification.nativeElement.click()
      } else {
        localStorage.setItem('token', response.token);
        this.users.setUser(response.user)
        this.user = response.user
      }
    }, error => {
      this.loggingIn = false
    });
  }

  sendVerification() {
    this.sendingVerification = true
    this.mailer.sendVerification(this.invitation.email).subscribe(res => {
      this.sendingVerification = false
      this.closeSendVerification.nativeElement.click()
      if(res = 'message sent') {
        this.openSended.nativeElement.click()
      } else {
        this.openError.nativeElement.click()
      }
    })
  }

  recoverPassword() {
    this.openRecover.nativeElement.click()
  }

  signup() {
    if(this.user.password != this.passwordVerification) {
      this.verificationError = true
      return
    }
    this.verificationError = false
    this.signingUp = true
    const user = {
      ...this.user,
      email: this.invitation.email,
      agency_id: this.agency._id,
      permissions_id: this.invitation.permissions_id,
      invitation: this.invitation._id
    }
    this.users.signup(user).subscribe((response: Login) => {
      if(response.message == 'success') {
        this.mailer.sendVerification(response.user.email).subscribe(res => {
          this.signingUp = false
          if(res = 'message sent') {
            this.openVerify.nativeElement.click()
          } else {
            this.openError.nativeElement.click()
          }
        })
      }  else {
        this.signingUp = false
        this.openError.nativeElement.click()
      }
    }, error => {
      this.signingUp = false
    });
  }

  verifyPass() {
    if(!this.user.password.startsWith(this.passwordVerification)) this.verificationError = true
    else this.verificationError = false
  }

  reset() {
    this.sendingMail = true
    this.mailer.reset(this.invitation.email).subscribe(response => {
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

  reject() {
    this.rejectLoading = true
    this.invitations.reject(this.invitation._id).subscribe(res => {
      this.rejectLoading = false
      if(res = 'success') this.router.navigate(['/inmobiliaria'])
    })
  }

  accept() {
    this.acceptLoading = true
    this.users.acceptInvitation(this.invitation).subscribe(res => {
      this.acceptLoading = false
      if(res == 'success') {
        this.router.navigate(['/inmobiliaria'])
      } else {
        this.openError.nativeElement.click()
      }
    })
  }

}
