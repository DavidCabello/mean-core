import { Component, OnInit } from '@angular/core';
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

  user = new User();
  error = false;

  constructor(private userService: UserService,
              private mailerService: MailerService,
              private router: Router) { }

  ngOnInit() {
    
  }

  login() {
    this.userService.login(this.user).subscribe((response: Login) => {
      this.userService.setUser(response.user);
      localStorage.setItem('token', response.token);
      this.router.navigate(['/']);
    });
  }

  reset() {
    this.mailerService.reset(this.user.email).subscribe(response => {
      
    });
  }

}
