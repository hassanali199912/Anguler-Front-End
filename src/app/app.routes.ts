import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { PymentComponent } from './components/pyment/pyment.component';
import { CarddetailsComponent } from './components/carddetails/carddetails.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentsuccessfulComponent } from './components/paymentsuccessful/paymentsuccessful.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'pyment',
        component: PymentComponent,
      },
      {
        path: 'details',
        component: CarddetailsComponent,
      },
      {
        path: 'AddProduct',
        component: AddProductComponent,
      },
      {
        path: 'AddCategory',
        component: AddCategoryComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'paymentSuccess',
        component: PaymentsuccessfulComponent,
      },
    ],
  },
];
