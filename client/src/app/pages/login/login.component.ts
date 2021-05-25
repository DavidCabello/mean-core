import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Login, User } from 'src/app/models/user';
import { MailerService } from 'src/app/services/mailer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User = new User()
  error: boolean = false

  loggingIn: boolean = false
  sendingMail: boolean = false

  openRecoverSuccess: ElementRef

  @ViewChild('closeRecover', {static: false}) closeRecover: ElementRef

  constructor(private userService: UserService,
              private mailerService: MailerService,
              private router: Router) { }

  ngOnInit() {
    
  }

  login() {
    this.error = false
    this.loggingIn = true
    this.userService.login(this.user).subscribe((response: Login) => {
      this.loggingIn = false
      if (response.message == 'invalid') {
        this.error = true
      } else {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/'])
      }
    }, error => {
      console.log(error)
      this.loggingIn = false
    });
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

}
