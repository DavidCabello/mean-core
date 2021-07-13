import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from 'src/app/models/user';
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
  @ViewChild('background', {static: false}) background: ElementRef
  @ViewChild('openButton', {static: false}) openButton: ElementRef
  @Output() handler = new EventEmitter<ElementRef>()

  user: User = new User()

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.user.subscribe(user => {
      this.user = user
    })
  }

  ngAfterViewInit() {
    this.handler.emit(this.openButton)
  }

  open() {
    TweenMax.to(this.base.nativeElement, 1, {transform : 'translateX(0)', ease: Expo.easeOut});
    this.background.nativeElement.style.display = 'block'
    TweenMax.to(this.background.nativeElement, 1, {backdropFilter: 'blur(4px) brightness(0.8)', ease: Expo.easeOut});
  }

  close(){
    TweenMax.to(this.base.nativeElement, 1, {transform : "translateX(100vw)", ease: Expo.ease});
    this.background.nativeElement.style.display = 'none'
    TweenMax.to(this.background.nativeElement, 1, {backdropFilter: 'blur(0) brightness(1)', ease: Expo.ease});
  }

  logout() {
    this.userService.logout()
  }

}
