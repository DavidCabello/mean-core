import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailerService {

  constructor(private http: HttpClient) { }

  sendMail(mail) {
    return this.http.post(`${environment.apiURL}/mailer/send`, mail);
  }

  reset(email) {
    return this.http.post(`${environment.apiURL}/mailer/forgetPassword`, {email});
  }

  sendVerification(email) {
    return this.http.post(`${environment.apiURL}/mailer/verify`, {email})
  }

  invite(invitation) {
    return this.http.post(`${environment.apiURL}/mailer/invite`, invitation)
  }

}
