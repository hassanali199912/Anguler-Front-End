import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../interfaces/iproduct';

@Component({
  selector: 'app-products',
  imports: [CardComponent,RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products:IProduct[] = [];

  constructor(private _ProductsService:ProductService){}

  ngOnInit(): void {
    this._ProductsService.GetProducts().subscribe({
      next:(res)=>{
        this.products = res.data;
        console.log(res.data);
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
}
