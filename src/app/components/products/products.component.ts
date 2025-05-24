import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { RouterModule } from '@angular/router';
import { RouterLink,RouterLinkActive  } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CardComponent,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

}
