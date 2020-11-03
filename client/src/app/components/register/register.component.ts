import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user = new User();
  isError = false;

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.user.role = 'user';
    this.userService.registerUser(this.user).subscribe(user => {
        this.router.navigate(['/profile']);
    });
  }

}
