import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { LoginResponse } from '../../domain/Auth';



@Component({
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  LoginFrom = new FormGroup({
    email: new FormControl("hassan@app.com", [Validators.required, Validators.email]),
    password: new FormControl("Hh@12345678910", [Validators.required, Validators.minLength(8)]),
  });

  constructor(private authService: AuthService, private router: Router) {
  }
  onSubmit() {
    if (this.LoginFrom.valid) {
      this.authService.SetLoginForm(this.LoginFrom.value).subscribe({
        next: (res: LoginResponse) => {
          const token = res?.data?.token;
          if (token) {
            localStorage.setItem('token', token);
            this.router.navigate(['/main']);
          } else {
            alert('Login failed: token not found');
          }

        },
        error: (error) => {
          alert('Login failed!');
          console.error(error);

        }
      })

    }
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     this.authService.SetLoginForm(this.loginForm.value).subscribe({
  //       next: (res) => {
  //         const token = res?.data?.token;
  //         if (token) {
  //           localStorage.setItem('token', token);
  //           this.router.navigate(['/main']);
  //         } else {
  //           alert('Login failed: token not found');
  //         }
  //       },
  //       error: (err) => {
  //         alert('Login failed!');
  //         console.error(err);
  //       }
  //     });
  //   }
  // }
}
