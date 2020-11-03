import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import * as $ from 'jquery';
import {Expo} from 'gsap/all';
import { Router } from '@angular/router';
declare var TweenMax: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  close(){
    TweenMax.to($(".js-menu"), 1, {opacity: .3, transform : "translateX(100vw)", ease: Expo.easeIn});
  }

  logout() {
    this.userService.logoutUser().subscribe(data => {
      this.userService.setUser(null);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }

}
