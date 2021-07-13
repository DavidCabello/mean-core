import { Component, ElementRef, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  openMenu: ElementRef

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() { }

}
