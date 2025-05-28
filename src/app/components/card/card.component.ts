import { Component, Input, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces/iproduct';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() products: IProduct[] = [];
  isLoading = false;
  errorMsg = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // No need to fetch products anymore as they are passed as input
    this.isLoading = false;
  }
}
