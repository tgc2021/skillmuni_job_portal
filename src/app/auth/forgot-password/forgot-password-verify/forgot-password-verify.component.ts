import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password-verify.component.html',
  styleUrls: ['./forgot-password-verify.component.css']
})
export class ForgotPasswordVerifyComponent implements OnInit, AfterViewInit {
  code: { value: string }[] = [
    { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }
  ];
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  countdown: number = 0;
  timer: any = null;
  verifying: boolean = false;
  verified: boolean = false;

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
    this.startCountdown();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.codeInputs && this.codeInputs.first) {
        this.codeInputs.first.nativeElement.focus();
      }
    });
  }

  onInput(event: any, idx: number) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) value = value.charAt(value.length - 1);
    this.code[idx].value = value;
    event.target.value = value;
    // Move focus only if a value was entered and not on last input
    if (value && idx < 5) {
      const nextInput = this.codeInputs.toArray()[idx + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, idx: number) {
    if (event.key === 'Backspace' && this.code[idx].value === '' && idx > 0) {
      this.codeInputs.toArray()[idx - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (/^[0-9]{6}$/.test(pasted)) {
      for (let i = 0; i < 6; i++) {
        this.code[i].value = pasted[i];
      }
      setTimeout(() => {
        this.codeInputs.toArray()[5].nativeElement.focus();
      });
      event.preventDefault();
    }
  }

  get codeValue() {
    return this.code.map(d => d.value).join('');
  }

  onSubmit() {
    if (this.codeValue.length < 6) {
      this.errorMessage = 'Please enter the 6-digit code.';
      return;
    }
    this.errorMessage = '';
    this.verifying = true;
    this.authService.verifyOtp(this.email, this.codeValue).subscribe({
      next: () => {
        this.verified = true;
        this.successMessage = "You're Verified!";
        setTimeout(() => {
          this.router.navigate(['/forgot-password/create'], { queryParams: { email: this.email, token: 'dummy-token' } });
        }, 1200);
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || 'The verification code you entered is invalid or has expired.';
        this.verified = false;
      },
      complete: () => {
        this.verifying = false;
      }
    });
  }

  resendLink() {
    if (this.countdown === 0) {
      this.countdown = 30;
      this.code = [
        { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }
      ];
      this.errorMessage = '';
      this.successMessage = '';
      this.verifying = true;
      this.authService.sendOtp(this.email).subscribe({
        next: () => {
          this.verifying = false;
          this.startCountdown();
        },
        error: (err: any) => {
          this.verifying = false;
          this.errorMessage = err?.error?.message || 'Failed to resend OTP. Please try again.';
        }
      });
    }
  }

  startCountdown() {
    this.countdown = 30;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.countdown = 0;
      }
    }, 1000);
  }
} 