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

  reset(mail) {
    return this.http.post(`${environment.apiURL}/mailer/forgetPassword`, mail);
  }

}
