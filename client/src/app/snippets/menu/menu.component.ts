import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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

  @ViewChild('base', {static: false}) base: ElementRef
  @ViewChild('openButton', {static: false}) openButton: ElementRef
  @Output() handler = new EventEmitter<ElementRef>()

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.handler.emit(this.openButton)
  }

  open() {
    TweenMax.to(this.base.nativeElement, 1, {autoAlpha: 1, transform : 'translateX(0)', ease: Expo.easeOut});
  }

  close(){
    TweenMax.to(this.base.nativeElement, 1, {opacity: .3, transform : "translateX(100vw)", ease: Expo.ease});
  }

  logout() {
    this.userService.logout()
  }

}
