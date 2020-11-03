import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MailerService } from '../../services/mailer.service';
import { Router } from '@angular/router';
import { User, Login } from 'src/app/models/user';

class Reset {
  email: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  login_info = new Login();
  isError = false;
  userMail = new Reset();
  @ViewChild('resetButton', {static: false}) resetButton: ElementRef;

  constructor(
    private userService: UserService,
    private mailerService: MailerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.login_info.user = new User();
  }

  login() {
    this.userService.loginUser(this.login_info.user).subscribe((data: Login) => {
      this.userService.setUser(data.user);
      localStorage.setItem('token', data.token);
      this.router.navigate(['/profile']);
    });
  }

  reset() {
    this.mailerService.reset(this.userMail).subscribe(data => {
      this.resetButton.nativeElement.click();
    });
  }

}
