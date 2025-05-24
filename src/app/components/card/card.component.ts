import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLink  } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [ RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

}
