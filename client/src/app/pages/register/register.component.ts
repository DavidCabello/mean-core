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
  
  user = new User();
  error = false;

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {

  }

  register() {
    //You can change user.role to be 'user' or 'admin'
    this.user.role = 'user';
    this.userService.signup(this.user).subscribe((response: Login) => {
        this.userService.setUser(response.user);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
    });
  }

}
