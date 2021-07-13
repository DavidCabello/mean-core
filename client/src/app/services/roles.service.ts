import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  create(object) {
    return this.http.post(`${environment.apiURL}/roles/create`, object);
  }

  all() {
    return this.http.get(`${environment.apiURL}/roles/all`);
  }

  one(id) {
    return this.http.get(`${environment.apiURL}/roles/one/${id}`);
  }

  update(object) {
    return this.http.put(`${environment.apiURL}/roles/update`, object);
  }

  delete(id) {
    return this.http.delete(`${environment.apiURL}/roles/delete/${id}`);
  }

  user() {
    return this.http.get(`${environment.apiURL}/roles/user`)
  }

}