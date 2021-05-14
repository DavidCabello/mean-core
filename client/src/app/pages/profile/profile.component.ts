import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  user = new User();
  password = ''

  constructor(public userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.userService.user.subscribe(user => {
      this.user = user || this.user
    })
  }

  update() {
    this.userService.update(this.user).subscribe((updated: User) => {
      this.user = updated
    })
  }

  updatePassword() {
    this.userService.updatePassword(this.user._id, this.password).subscribe((updated: User) => {
      this.user = updated
    })
  }

  logout() {
    this.userService.logout()
  }

}
