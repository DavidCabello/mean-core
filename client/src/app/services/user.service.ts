import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user_ = new BehaviorSubject(undefined);
  user = this.user_.asObservable();

  constructor(private http: HttpClient) { }

  setUser(user) {
    this.user_.next(user);
  }

  registerUser(user) {
    return this.http.post(`${environment.apiURL}/users/register`, user);
  }

  loginUser(user) {
    return this.http.post(`${environment.apiURL}/users/login`, user);
  }

  getUser() {
    return this.http.get(`${environment.apiURL}/users/current`);
  }

  getAllUsers(){
    return this.http.get(`${environment.apiURL}/users/all`);
  }

  getOneUser(userID) {
    return this.http.get(`${environment.apiURL}/one/${userID}`);
  }

  updateUser(user) {
    return this.http.put(`${environment.apiURL}/users/update/${user._id}`, user);
  }

  logoutUser() {
    return this.http.get(`${environment.apiURL}/users/logout`);
  }

  resetPassword(password, encoded) {
    return this.http.post(`${environment.apiURL}/users/forgot?encoded=${encoded}`, password);
  }

  resetPasswordID(password, userID) {
    return this.http.post(`${environment.apiURL}/users/forgot?id=${userID}`, password);
  }

  updatePassword(id, password){
    return this.http.put(`${environment.apiURL}/users/updatePass/${id}`, password);
  }

  deleteUser(userID) {
    return this.http.delete(`${environment.apiURL}/users/delete/${userID}`);
  }

}
