import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  create(object) {
    return this.http.post(`${environment.apiURL}/task/create`, object);
  }

  all() {
    return this.http.get(`${environment.apiURL}/task/all`);
  }

  one(id) {
    return this.http.get(`${environment.apiURL}/task/one/${id}`);
  }

  update(object) {
    return this.http.put(`${environment.apiURL}/task/update`, object);
  }

  delete(id) {
    return this.http.delete(`${environment.apiURL}/task/delete/${id}`);
  }

  client(id) {
    return this.http.get(`${environment.apiURL}/task/client/${id}`)
  }

  todo() {
    return this.http.get(`${environment.apiURL}/task/todo`)
  }

  user() {
    return this.http.get(`${environment.apiURL}/task/user`)
  }

  state(state) {
    return this.http.get(`${environment.apiURL}/task/state/${state}`)
  }
}