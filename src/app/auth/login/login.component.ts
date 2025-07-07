import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SignInRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showErrors: boolean = false;
  passwordVisible: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }



  onSubmit() {
    this.showErrors = true;
    this.errorMessage = '';

    if (!this.email || !this.password) {
      return;
    }

    this.isLoading = true;

    const signInRequest: SignInRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.signIn(signInRequest).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToSignUp(): void {
  this.router.navigate(['/sign-up']);
}
}