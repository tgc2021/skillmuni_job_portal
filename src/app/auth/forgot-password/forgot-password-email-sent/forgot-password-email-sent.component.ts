import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password-email-sent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './forgot-password-email-sent.component.html',
  styleUrls: ['./forgot-password-email-sent.component.css']
})
export class ForgotPasswordEmailSentComponent implements OnInit {
  email: string = '';
  isResending: boolean = false;
  resendSuccess: boolean = false;
  resendError: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the email from route params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || 'your email';
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  resendEmail() {
    if (this.isResending) return;
    
    this.isResending = true;
    this.resendError = '';
    this.resendSuccess = false;

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, you would call your auth service here to resend the email
        this.resendSuccess = true;
      } catch (error) {
        this.resendError = 'Failed to resend email. Please try again.';
        console.error('Resend email error:', error);
      } finally {
        this.isResending = false;
      }
    }, 1000);
  }
}
