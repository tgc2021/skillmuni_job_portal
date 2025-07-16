import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, JobPosting, SavedJob } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  jobList: JobPosting[] = [];
  savedJobs: SavedJob[] = [];

  constructor(private router: Router, private apiService: ApiService) {
    this.jobList = this.apiService.getJobList();
    this.savedJobs = this.apiService.getSavedJobs();
  }

  navigateToAllJobs() {
    this.router.navigate(['/dashboard/view-all-jobs'], { queryParams: { type: this.viewMode } });
  }

  infoCards = [
    {
      title: 'Live Jobs',
      value: '24',
      icon: 'assets/icons/live-job-icon.png', 
    },
    {
      title: 'Applications Received',
      value: '220',
      icon: 'assets/icons/applications-icon.png',
    },
    {
      title: 'Shortlist in Progress',
      value: '80',
      icon: 'assets/icons/shortlist-icon.png',
    },
    {
      title: 'Offers on the Table',
      value: '02',
      icon: 'assets/icons/offers-icon.png',
    },
  ];

  dropdownOpenIndex: number | null = null;

  statusOptions = [
    { label: 'Open', class: 'status-open' },
    { label: 'Pause', class: 'status-paused' },
    { label: 'Close', class: 'status-closed' }
  ];

  toggleDropdown(index: number): void {
    this.dropdownOpenIndex = this.dropdownOpenIndex === index ? null : index;
  }

  changeStatus(index: number, option: any): void {
    if (this.jobList[index]) {
      this.jobList[index].status = option.label;
      this.jobList[index].statusClass = option.class;
    }
    this.dropdownOpenIndex = null;
  }

  sortDropdownOpen = false;

  sortOptions: string[] = [
    'Newest First',
    'Oldest First',
    'Open Jobs',
    'Paused Jobs',
    'Closed Jobs',
    'Expired Jobs'
  ];

  selectedSortOption: string = 'Newest First';

  toggleSortDropdown() {
    this.sortDropdownOpen = !this.sortDropdownOpen;
  }

  selectSortOption(option: string) {
    this.selectedSortOption = option;
    this.sortDropdownOpen = false;
  }

  closeSortDropdown() {
    this.sortDropdownOpen = false;
  }

  viewMode: 'all' | 'saved' = 'all';

  setViewMode(mode: 'all' | 'saved') {
    this.viewMode = mode;
  }
}
