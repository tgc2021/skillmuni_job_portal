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
  viewMode: 'all' | 'saved' = 'all';
  dropdownOpenIndex: number | null = null;
  sortDropdownOpen = false;
  selectedSortOption: string = 'Newest First';
  
  statusOptions = [
    { label: 'Open', class: 'status-open' },
    { label: 'Pause', class: 'status-paused' },
    { label: 'Close', class: 'status-closed' }
  ];

  sortOptions: string[] = [
    'Newest First',
    'Oldest First',
    'Open Jobs',
    'Paused Jobs',
    'Closed Jobs',
    'Expired Jobs'
  ];

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

  constructor(private router: Router, private apiService: ApiService) {
    this.jobList = this.apiService.getJobList();
    this.savedJobs = this.apiService.getSavedJobs();
  }

  // Navigation methods
  navigateToAllJobs(): void {
    this.router.navigate(['/dashboard/view-all-jobs'], { queryParams: { type: this.viewMode } });
  }

  navigateToPostJob(): void {
    this.router.navigate(['/dashboard/post-job']);
  }

  navigateToManageCandidates(jobId: string): void {
    this.router.navigate(['/dashboard/manage-candidates', jobId]);
  }

  // View mode methods
  setViewMode(mode: 'all' | 'saved'): void {
    this.viewMode = mode;
  }

  // Status dropdown methods
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

  // Sort dropdown methods
  toggleSortDropdown(): void {
    this.sortDropdownOpen = !this.sortDropdownOpen;
  }

  selectSortOption(option: string): void {
    this.selectedSortOption = option;
    this.sortDropdownOpen = false;
  }

  closeSortDropdown(): void {
    this.sortDropdownOpen = false;
  }
}
