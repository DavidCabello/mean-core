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

  signingUp: boolean = false

  passwordVerification: string

  existingEmail: boolean = false
  verificationError: boolean = false

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {

  }

  register() {
    if(this.user.password != this.passwordVerification) {
      this.verificationError = true
      return
    }
    this.verificationError = false
    this.signingUp = true
    this.user.role = 'user';
    this.userService.signup(this.user).subscribe((response: Login) => {
      this.signingUp = false
      if(response.message == 'success') {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/'])
      } else if(response.message == 'existing') {
        this.existingEmail = true
      } else {
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

}
