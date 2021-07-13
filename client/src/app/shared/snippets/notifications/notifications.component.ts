import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Expo} from 'gsap/all';

declare var TweenMax: any;

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notificationList = []

  opened: boolean = false
  inside = true

  @ViewChild('base', {static: false}) base: ElementRef
  // @ViewChild('background', {static: false}) background: ElementRef
  @ViewChild('settings', {static: false}) settings: ElementRef

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if(window.innerWidth > 768) document.body.addEventListener('click', () => {
      if(!this.inside && this.opened) this.close()
      this.inside = false
    })
    document.body.appendChild(this.settings.nativeElement)
  }

  toggle() {
    if(this.opened) {
      this.close()
    } else {
      this.base.nativeElement.style.display = 'block'
      // this.background.nativeElement.style.display = 'block'
      TweenMax.to(this.base.nativeElement, 1, {opacity: 1, ease: Expo.easeOut});
      // TweenMax.to(this.background.nativeElement, 1, {backdropFilter: 'blur(4px) brightness(0.8)', ease: Expo.easeOut});
      this.opened = true
      this.inside = true
    }
  }

  close() {
    TweenMax.to(this.base.nativeElement, 1, {opacity: 0, display: 'none', ease: Expo.easeOut});
    // TweenMax.to(this.background.nativeElement, 1, {backdropFilter: 'blur(0) brightness(1)', display: 'none', ease: Expo.easeOut});
    this.opened = false
  }

}
