import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { ICategory } from '../../interfaces/icategory';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  category: ICategory = {
    name: '',
    description: ''
  };
  constructor(
    private _CategoryService: CategoryService,
    private router: Router
  ){}

  onSubmit() {
    this.createCategory(this.category);
  }

  createCategory(category:ICategory) {
    this._CategoryService.createCategory(category).subscribe({
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