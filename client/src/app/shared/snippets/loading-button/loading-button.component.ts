import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss']
})
export class LoadingButtonComponent implements OnInit {

  @Input() class: string = 'primary'
  @Input() label: string
  @Input() loading: boolean = false
  @Input() type: string = 'submit'
  @Input() responsive: boolean = true
  @Input() disable: boolean = false

  @Output() clicked = new EventEmitter<any>()

  @ViewChild('base', {static: false}) base: ElementRef

  showLoader: boolean = false

  viewInit: boolean = false

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    if(this.loading && this.viewInit) {
      this.base.nativeElement.style.minWidth = this.base.nativeElement.getBoundingClientRect().width + 'px'
      this.base.nativeElement.style.minHeight = this.base.nativeElement.getBoundingClientRect().height + 'px'
      this.showLoader = true
    } else this.showLoader = false
  }

  ngAfterViewInit() {
    this.viewInit = true
    if (this.responsive && document.body.clientWidth < 576) this.base.nativeElement.style.width = '100%'
  }

}
