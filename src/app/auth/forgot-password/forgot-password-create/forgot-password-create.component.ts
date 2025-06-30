import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-create.component.html',
  styleUrls: ['./forgot-password-create.component.css']
})
export class ForgotPasswordCreateComponent implements OnInit {
  passwordForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  errorMessage = '';
  email = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private forgotPasswordService: ForgotPasswordService
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Get email and token from the service or route params
    this.forgotPasswordService.email$.subscribe(email => this.email = email || '');
    this.forgotPasswordService.token$.subscribe(token => this.token = token || '');
    
    // In a real app, you might want to validate the token here
    if (!this.token) {
      this.router.navigate(['/forgot-password']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  get password() { return this.passwordForm.get('password'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  getPasswordErrors() {
    if (!this.password?.errors) return '';
    
    if (this.password.errors['required']) return 'Password is required';
    if (this.password.errors['minlength']) return 'Password must be at least 8 characters';
    if (this.password.errors['pattern']) {
      return 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }


    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, you would call your auth service here to reset the password
        // For example:
        // await this.authService.resetPassword(this.email, this.token, this.passwordForm.value.password);
        this.router.navigate(['/forgot-password/success']);
      } catch (error) {
        this.errorMessage = 'Failed to reset password. Please try again.';
        console.error('Reset password error:', error);
      }
    }, 1000);
  }

  navigateBack() {
    this.router.navigate(['/forgot-password']);
  }
}
