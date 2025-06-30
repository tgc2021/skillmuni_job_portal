import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  companyName: string = '';
  password: string = '';
  confirmPassword: string = '';
  showErrors: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Add any initialization logic here
  }

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
  navigateToLogin(){
    this.router.navigate(['/login']);
  }
}