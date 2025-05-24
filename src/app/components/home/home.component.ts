import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { AboutusComponent } from '../aboutus/aboutus.component';
@Component({
  selector: 'app-home',
  imports: [AboutusComponent,SliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
