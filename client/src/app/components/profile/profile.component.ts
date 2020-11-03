import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user = new User();
  product = new Product();
  products = [];

  constructor(
    public userService: UserService, 
    public productService: ProductService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser(() => {
      this.getProducts();
    });
  }

  getUser(cb){
    this.userService.user.subscribe(response => {
      this.user = response;
      return cb();
    });
  }

  getProducts(){
    this.productService.getUserProducts().subscribe((response: any) => {
      this.products = response;  
    }); 
  }

  createProduct(){
    this.product.userID = this.user._id;
    this.productService.createProduct(this.product).subscribe(response => {
      location.reload();
    });
  }

  updateProduct(product){
    this.productService.updateProduct(product).subscribe(response => {
      location.reload();
    });
  }

  deleteProduct(product){
    this.productService.deleteProduct(product._id).subscribe(response => {
      location.reload();
    });
  }

}
