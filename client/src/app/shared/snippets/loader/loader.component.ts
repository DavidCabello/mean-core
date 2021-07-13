import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'page-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() display: boolean = true

  constructor() { }

  ngOnInit() {
  }

}
