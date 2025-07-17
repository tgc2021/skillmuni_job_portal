import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SplashScreenComponent implements OnInit {
  isExiting = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Trigger animation and then navigate
    setTimeout(() => {
      this.isExiting = true;

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500); // Wait for animation to complete
    }, 1500);
  }
}
  