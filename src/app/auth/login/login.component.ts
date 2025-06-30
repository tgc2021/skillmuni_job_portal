import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  companyName: string = '';
  password: string = '';
  confirmPassword: string = '';
  showErrors: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSubmit() {
    this.showErrors = true;

    if (!this.companyName || this.password.length < 8 || this.password !== this.confirmPassword) {
      return;
    }

    // Proceed with submission logic
  }

  navigateToSignUp(): void {
  this.router.navigate(['/sign-up']);
}
}