import { Component } from '@angular/core';
import { ApiService, JobPosting, SavedJob } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-all-jobs',
  templateUrl: './view-all-jobs.component.html',
  styleUrls: ['./view-all-jobs.component.css']
})
export class ViewAllJobsComponent {
  jobList: JobPosting[] = [];
  savedJobs: SavedJob[] = [];
  viewType: 'all' | 'saved' = 'all';
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

  constructor(private apiService: ApiService, private route: ActivatedRoute, private location: Location) {
    this.route.queryParams.subscribe(params => {
      this.viewType = params['type'] === 'saved' ? 'saved' : 'all';
      if (this.viewType === 'all') {
        this.jobList = this.apiService.getJobList();
      } else {
        this.savedJobs = this.apiService.getSavedJobs();
      }
    });
  }

  onBackClick() {
    this.location.back();
  }
}
