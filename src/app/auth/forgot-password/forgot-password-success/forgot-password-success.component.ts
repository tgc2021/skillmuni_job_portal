import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './forgot-password-success.component.html',
  styleUrls: ['./forgot-password-success.component.css']
})
export class ForgotPasswordSuccessComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
