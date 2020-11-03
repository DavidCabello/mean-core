import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {Expo} from 'gsap/all';
declare var TweenMax: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logoutUser().subscribe(data => {
      this.userService.setUser(null);
      localStorage.removeItem('token');
      this.router.navigate(['/home']);
    });
  }

  open() {
    TweenMax.to($('.js-menu'), 1, {autoAlpha: 1, transform : 'translateX(0)', ease: Expo.easeOut});
  }

}
