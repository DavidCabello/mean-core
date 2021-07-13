import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit {

  password: string
  verification: string

  updating: boolean = false

  error: boolean = false

  hidePassword: boolean = true
  hideVerification: boolean = true

  openSuccess: ElementRef
  openError: ElementRef

  constructor(private users: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

  }

  restore() {
    if(this.password != this.verification) {
      this.error = true
      return
    }
    this.updating = true
    this.route.queryParams.subscribe(params => {
      if(params.encoded) this.users.resetPassword(this.password, params.encoded).subscribe(res => {
        this.updating = false
        this.openSuccess.nativeElement.click()
      }, error => this.openError.nativeElement.click())
      else this.openError.nativeElement.click()
    })
  }

  verifyPass() {
    if(!this.password.startsWith(this.verification)) this.error = true
    else this.error = false
  }

  returnHome() {
    // this.router.navigate(['/'])
    location.replace(environment.siteURL)
  }

  reload() {
    location.reload()
  }

}
