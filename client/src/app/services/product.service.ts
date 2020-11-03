import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  createProduct(product) {
    return this.http.post(`${environment.apiURL}/product/create`, product);
  }

  getUserProducts() {
    return this.http.get(`${environment.apiURL}/product/get`);
  }

  getAllProducts() {
    return this.http.get(`${environment.apiURL}/product/all`);
  }

  getOneProduct(productID){
    return this.http.get(`${environment.apiURL}/product/one/${productID}`);
  }

  updateProduct(product) {
    return this.http.put(`${environment.apiURL}/product/update/${product._id}`, product);
  }

  deleteProduct(productID) {
    return this.http.delete(`${environment.apiURL}/product/delete/${productID}`);
  }

}
