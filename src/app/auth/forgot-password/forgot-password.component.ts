import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  showError: boolean = false;

  countdown: number = 0;
  timer: any = null;
  errorMessage: string = '';
  sentState: 'idle' | 'sending' | 'sent' = 'idle'; // idle, sending, sent
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.sendOtp(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/forgot-password/verify'], { queryParams: { email: this.email } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to send OTP. Please try again.';
      }
    });
  }

  resendLink() {
    if (this.countdown === 0 && this.sentState !== 'sending') {
      this.sentState = 'sending';
      // Simulate API call again
      setTimeout(() => {
        try {

          this.sentState = 'sent';
          this.startCountdown();
        } catch (error) {
          this.errorMessage = 'An error occurred. Please try again.';
          this.sentState = 'idle';
          console.error('Forgot password error:', error);
        }
      }, 1000);
    }
  }

  startCountdown() {
    this.countdown = 30;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 1000);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
