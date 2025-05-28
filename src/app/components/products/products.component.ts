import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { IProduct } from '../../interfaces/iproduct';
import { CardComponent } from '../card/card.component';
import { ICategory } from '../../interfaces/icategory';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  categories: ICategory[] = [];
  selectedCategory: string = 'all';

  constructor(
    private _ProductsService: ProductService,
    private _CategoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
    this.loadCategories();
  }

  loadAllProducts() {
    this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.filteredProducts = this.products;
        console.log("All Products:", this.products);
      },
      error: (err) => console.error(err)
    });
  }

  loadCategories() {
    this._CategoryService.getCategories(1, 100).subscribe({
      next: (res) => {
        this.categories = res.data.map(cat => ({
          name: cat.name,
          description: cat.description || ''
        }));
        console.log("Categories:", this.categories);
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  onCategoryChange(categoryName: string) {
    this.selectedCategory = categoryName;
    if (categoryName === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.category === categoryName
      );
    }
  }
}
