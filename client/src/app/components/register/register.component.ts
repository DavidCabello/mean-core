import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Login, User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  login_info = new Login();
  isError = false;

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
    this.login_info.user = new User();
  }

  register() {
    //You can change user.role to be 'user' or 'admin'
    this.login_info.user.role = 'user';
    this.userService.registerUser(this.login_info.user).subscribe((response: Login) => {
        this.userService.setUser(response.user);
        localStorage.setItem('token', response.token);
        if(response.user.role === 'user'){
          this.router.navigate(['/profile']);
        }
    });
  }

}
