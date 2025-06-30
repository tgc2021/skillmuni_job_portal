import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  orgLogoUrl = 'assets/logo.svg';
  userProfileImg = 'assets/profile.svg';
  activeLink: 'home' | 'leaderboard' | 'dashboard' = 'home';
  notifications: string[] = ['Welcome to SkillMuni!', 'You have a new message.'];
  showNotifications = false;

  setActiveLink(link: 'home' | 'leaderboard' | 'dashboard') {
    this.activeLink = link;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}

