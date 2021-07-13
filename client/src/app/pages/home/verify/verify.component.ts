import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  verified: boolean = false
  error: boolean = false

  constructor(private users: UserService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params.encoded) this.users.verify(params.encoded).subscribe(res => {
        if(res == 'success') this.verified = true
        else this.error = true
      })
    })
  }

  returnHome() {
    location.replace(environment.siteURL)
  }

}
