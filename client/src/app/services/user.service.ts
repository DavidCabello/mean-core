import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user_ = new BehaviorSubject(undefined);
  user = this.user_.asObservable();

  constructor(private http: HttpClient,
              private router: Router) { }

  setUser(user) {
    this.user_.next(user);
  }

  signup(user) {
    return this.http.post(`${environment.apiURL}/users/signup`, user);
  }

  login(user) {
    return this.http.post(`${environment.apiURL}/users/login`, user);
  }

  validate(encoded) {
    return this.http.get(`${environment.apiURL}/users/validate?encoded=${encoded}`);
  }

  logged() {
    return this.http.get(`${environment.apiURL}/users/logged`);
  }

  all(){
    return this.http.get(`${environment.apiURL}/users/all`);
  }

  one(id) {
    return this.http.get(`${environment.apiURL}/one/${id}`);
  }

  update(user) {
    return this.http.put(`${environment.apiURL}/users/update`, user);
  }

  logout() {
    this.http.get(`${environment.apiURL}/users/logout`).subscribe(() => {
      this.setUser(null);
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    })
  }

  resetPassword(password, encoded) {
    return this.http.post(`${environment.apiURL}/users/forgot?encoded=${encoded}`, password);
  }

  resetPasswordId(password, id) {
    return this.http.post(`${environment.apiURL}/users/forgot?id=${id}`, password);
  }

  updatePassword(id, password){
    return this.http.put(`${environment.apiURL}/users/updatePass`, {password, id});
  }

  delete(id) {
    return this.http.delete(`${environment.apiURL}/users/delete/${id}`);
  }

}
