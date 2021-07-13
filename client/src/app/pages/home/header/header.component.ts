import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'home-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User

  constructor(private users: UserService) { }

  ngOnInit() {
    this.users.logged().subscribe((res: any) => {
      if(res != 'not logged in') this.user = res
    }, error => {
      
    })
  }

}
