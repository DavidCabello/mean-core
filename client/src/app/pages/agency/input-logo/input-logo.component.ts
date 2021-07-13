import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'input-logo',
  templateUrl: './input-logo.component.html',
  styleUrls: ['./input-logo.component.scss']
})
export class InputLogoComponent implements OnInit {

  @Input() url: string = ''
  @Input() editable: boolean = false

  @Output() uploaded = new EventEmitter<string>()

  constructor(private files: FileService) { }

  ngOnInit() {

  }

  uploadLogo(e) {
    if(e.target.files.length == 0) return
    this.files.uploadImage(e.target.files[0]).subscribe((url: string) => {
      this.uploaded.emit(url)
    })
  }

}
