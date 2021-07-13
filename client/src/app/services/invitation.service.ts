import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(private http: HttpClient) { }

  create(object) {
    return this.http.post(`${environment.apiURL}/invitation/create`, object);
  }

  all() {
    return this.http.get(`${environment.apiURL}/invitation/all`);
  }

  one(id) {
    return this.http.get(`${environment.apiURL}/invitation/one/${id}`);
  }

  update(object) {
    return this.http.put(`${environment.apiURL}/invitation/update`, object);
  }

  delete(id) {
    return this.http.delete(`${environment.apiURL}/invitation/delete/${id}`);
  }

  agency(id) {
    return this.http.get(`${environment.apiURL}/invitation/agency/${id}`)
  }

  decode(encoded) {
    return this.http.get(`${environment.apiURL}/invitation/decode?encoded=${encoded}`)
  }

  reject(id) {
    return this.http.put(`${environment.apiURL}/invitation/reject`, {id})
  }
}