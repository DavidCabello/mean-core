import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() name: string = 'modal'
  @Input() confirmation: boolean = false

  @Input() buttonClass: string = 'primary'
  @Input() buttonLabel: string = 'Abrir'
  @Input() showButton: boolean = true

  @Input() static: boolean = true
  @Input() centered: boolean = true
  @Input() overlapped: boolean = false
  @Input() size: string = 'default'

  @Input() times: boolean = false
  @Input() header: string
  @Input() body: string[]

  @Input() cancelButtonClass: string = 'bordered'
  @Input() acceptButtonClass: string = 'primary'
  @Input() cancelButtonLabel: string = 'Cancelar'
  @Input() acceptButtonLabel: string = 'Aceptar'

  @Output() response = new EventEmitter<boolean>()
  @Output() open = new EventEmitter<ElementRef>()

  @ViewChild('modal', {static: false}) modal: ElementRef
  @ViewChild('openButton', {static: false}) openButton: ElementRef
  @ViewChild('closeButton', {static: false}) closeButton: ElementRef

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    document.body.appendChild(this.modal.nativeElement)
    this.open.emit(this.openButton)
    if(this.static) {
      this.modal.nativeElement.setAttribute('data-bs-backdrop', 'static')
      this.modal.nativeElement.setAttribute('data-bs-keyboard', false)
    }
  }

  ngOnDestroy() {
    document.body.removeChild(this.modal.nativeElement)
  }

  emit(response) {
    this.closeButton.nativeElement.click()
    this.response.emit(response)
  }
}
