import { Injectable } from '@angular/core';

export interface JobPosting {
  title: string;
  datePosted: string;
  status: string;
  statusClass: string;
  expiry: string;
  rounds: string;
  applied: number;
}

export interface SavedJob {
  title: string;
  savedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private jobList: JobPosting[] = [
    {
      title: 'Software Engineer',
      datePosted: '2025-06-01',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-01',
      rounds: '3',
      applied: 120
    },
    {
      title: 'UI/UX Designer',
      datePosted: '2025-06-03',
      status: 'Pause',
      statusClass: 'status-paused',
      expiry: '2025-07-03',
      rounds: '2',
      applied: 85
    },
    {
      title: 'Digital Marketer',
      datePosted: '2025-06-05',
      status: 'Close',
      statusClass: 'status-closed',
      expiry: '2025-07-05',
      rounds: '1',
      applied: 95
    },
    {
      title: 'Product Manager',
      datePosted: '2025-06-07',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-07',
      rounds: '3',
      applied: 60
    },
    {
      title: 'DevOps Engineer',
      datePosted: '2025-06-09',
      status: 'Pause',
      statusClass: 'status-paused',
      expiry: '2025-07-09',
      rounds: '2',
      applied: 73
    },
    {
      title: 'QA Tester',
      datePosted: '2025-06-11',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-11',
      rounds: '2',
      applied: 55
    },
    {
      title: 'Data Analyst',
      datePosted: '2025-06-13',
      status: 'Close',
      statusClass: 'status-closed',
      expiry: '2025-07-13',
      rounds: '2',
      applied: 112
    },
    {
      title: 'Backend Developer',
      datePosted: '2025-06-15',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-15',
      rounds: '3',
      applied: 134
    },
    {
      title: 'Frontend Developer',
      datePosted: '2025-06-17',
      status: 'Pause',
      statusClass: 'status-paused',
      expiry: '2025-07-17',
      rounds: '2',
      applied: 89
    },
    {
      title: 'Content Strategist',
      datePosted: '2025-06-19',
      status: 'Close',
      statusClass: 'status-closed',
      expiry: '2025-07-19',
      rounds: '1',
      applied: 44
    }
  ];

  private savedJobs: SavedJob[] = [
    { title: 'Business Analyst', savedDate: '2025-06-20' },
    { title: 'DevOps Engineer', savedDate: '2025-06-18' },
    { title: 'Project Manager', savedDate: '2025-06-15' }
  ];

  constructor() { }

  getJobList(): JobPosting[] {
    return this.jobList;
  }

  getSavedJobs(): SavedJob[] {
    return this.savedJobs;
  }
} 