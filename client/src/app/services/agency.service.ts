import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  constructor(private http: HttpClient) { }

  create(object) {
    return this.http.post(`${environment.apiURL}/agency/create`, object);
  }

  all() {
    return this.http.get(`${environment.apiURL}/agency/all`);
  }

  one(id) {
    return this.http.get(`${environment.apiURL}/agency/one/${id}`);
  }

  update(object) {
    return this.http.put(`${environment.apiURL}/agency/update`, object);
  }

  delete(id) {
    return this.http.delete(`${environment.apiURL}/agency/delete/${id}`);
  }

  user() {
    return this.http.get(`${environment.apiURL}/agency/user`)
  }
}