import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  imports: [RouterLink, NgIf, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  regesterForm = new FormGroup(
    {
      name: new FormControl('hassanAli', [Validators.pattern(/^\S*$/), Validators.required, Validators.minLength(3)]),
      email: new FormControl("hassan10@app.com", [Validators.required, Validators.email]),
      password: new FormControl("Hh@12345678910", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('Hh@12345678910', [Validators.required, Validators.minLength(8)])
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get("password")?.value;
    const conformPassword = group.get("confirmPassword")?.value;

    return password === conformPassword ? null : { passwordMismatch: true }
  }


  constructor(private _authService: AuthService, private router: Router) {
  }

  isLoading = false;
  msgSuccess = false;
  errorMsg = '';

  onSubmit() {
    this.isLoading = true;
    this.errorMsg = '';
    if (this.regesterForm.valid) {
      const regesterData = {
        userName: this.regesterForm.get("name")?.value,
        email: this.regesterForm.get("email")?.value,
        password: this.regesterForm.get("password")?.value
      }
      console.log("this is data", regesterData);

      this._authService.SetRegisterForm(regesterData).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === true && res.data && res.data.token) {
            this.msgSuccess = true;
            setTimeout(() => {

              localStorage.setItem('userToken', res.data.token);
              this._authService.saveUserData();
              this.router.navigate(['/']);

            }, 1000);
          } else {
            console.log("error", res);

            this.errorMsg = res.massage || 'Regestration failed!';
            alert(this.errorMsg);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          this.errorMsg = 'Regestration failed!';
          alert(this.errorMsg);
        }
      });
    } else {
      this.isLoading = false;
    }
  }


}