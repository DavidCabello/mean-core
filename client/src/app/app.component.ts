import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-core';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    if (localStorage.getItem('token')) {
      this.userService.logged().subscribe(user => {
        this.userService.setUser(user);
      }, error => {
        
      }); 
    }
  }
  
}
