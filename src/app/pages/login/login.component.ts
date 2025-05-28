import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';



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

  isLoading = false;
  msgSuccess = false;
  errorMsg = '';

  constructor(private _authService: AuthService, private router: Router) {
  }

  
  onSubmit() {
    this.isLoading = true;
    this.errorMsg = '';
    if (this.LoginFrom.valid) {
      this._authService.SetLoginForm(this.LoginFrom.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === true && res.data && res.data.token) {
            this.msgSuccess = true;
            setTimeout(() => {
              // 1 - Save Token
              localStorage.setItem('userToken', res.data.token);

              // 2 - Decode and save user data
              this._authService.saveUserData();

              // 3 - Navigate to home
              this.router.navigate(['/main']);
            }, 1000);
          } else {
            // Handle failure
            this.errorMsg = res.massage || 'Login failed!';
            alert(this.errorMsg);
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsg = 'Login failed!';
          alert(this.errorMsg);
          console.error(error);
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  // onSubmit() {
  //   if (this.LoginFrom.valid) {
  //     this.authService.SetLoginForm(this.LoginFrom.value).subscribe({
  //       next: (res: LoginResponse) => {
  //         const token = res?.data?.token;
  //         if (token) {
  //           localStorage.setItem('token', token);
  //           this.router.navigate(['/main']);
  //         } else {
  //           alert('Login failed: token not found');
  //         }

  //       },
  //       error: (error) => {
  //         alert('Login failed!');
  //         console.error(error);

  //       }
  //     })

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