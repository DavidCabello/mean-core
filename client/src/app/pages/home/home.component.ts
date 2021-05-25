import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  //example
  loading: boolean = false

  constructor() { }

  ngOnInit() { }

  //example
  loadingExample() {
    this.loading = true
    const i = setInterval(() => {
      this.loading = false
      clearInterval(i)
    }, 4000)
  }

}
