import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carddetails',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carddetails.component.html',
  styleUrls: ['./carddetails.component.css']
})
export class CarddetailsComponent implements OnInit {
  product: Product | undefined;
  isLoading = true;
  errorMsg = '';
  image:string = "";

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    let randomNum = Math.floor(Math.random() * 10);
    this.image = `https://picsum.photos/350/350?random=${randomNum}`
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMsg = 'Invalid product ID.';
      this.isLoading = false;
      return;
    }

  this.productService.getProductById(id).subscribe({
  next: (res) => {
    this.product = res.data;  
    this.isLoading = false;
    console.log('Loaded product:', this.product);
  },
  error: (err) => {
    this.errorMsg = err.message || 'Failed to load product.';
    this.isLoading = false;
    console.log("Error:", err);
  }
});

}
}
