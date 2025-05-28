import { Component } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  product: IProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    brand: '',
    category: ''
  };

  constructor(
    private _productService: ProductService,
    private router: Router
  ) { }

  onSubmit() {
    this.createProduct(this.product);
  }

  createProduct(product: IProduct) {
    this._productService.createProduct(product).subscribe({
      next: (response) => {
        // console.log(response);
        this.router.navigate(['/main/products']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}