import { Injectable } from '@angular/core';

export interface JobPosting {
  id: string;
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
      id: '1',
      title: 'Software Engineer',
      datePosted: '2025-06-01',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-01',
      rounds: '3',
      applied: 120
    },
    {
      id: '2',
      title: 'UI/UX Designer',
      datePosted: '2025-06-03',
      status: 'Pause',
      statusClass: 'status-paused',
      expiry: '2025-07-03',
      rounds: '2',
      applied: 85
    },
    {
      id: '3',
      title: 'Digital Marketer',
      datePosted: '2025-06-05',
      status: 'Close',
      statusClass: 'status-closed',
      expiry: '2025-07-05',
      rounds: '1',
      applied: 95
    },
    {
      id: '4',
      title: 'Product Manager',
      datePosted: '2025-06-07',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-07',
      rounds: '4',
      applied: 110
    },
    {
      id: '5',
      title: 'Data Scientist',
      datePosted: '2025-06-09',
      status: 'Pause',
      statusClass: 'status-paused',
      expiry: '2025-07-09',
      rounds: '3',
      applied: 78
    },
    {
      id: '6',
      title: 'DevOps Engineer',
      datePosted: '2025-06-11',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-11',
      rounds: '2',
      applied: 92
    },
    {
      id: '7',
      title: 'Frontend Developer',
      datePosted: '2025-06-13',
      status: 'Close',
      statusClass: 'status-closed',
      expiry: '2025-07-13',
      rounds: '3',
      applied: 105
    },
    {
      id: '8',
      title: 'Backend Developer',
      datePosted: '2025-06-15',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-15',
      rounds: '3',
      applied: 88
    },
    {
      id: '9',
      title: 'Full Stack Developer',
      datePosted: '2025-06-17',
      status: 'Pause',
      statusClass: 'status-paused',
      expiry: '2025-07-17',
      rounds: '4',
      applied: 115
    },
    {
      id: '10',
      title: 'QA Engineer',
      datePosted: '2025-06-19',
      status: 'Open',
      statusClass: 'status-open',
      expiry: '2025-07-19',
      rounds: '2',
      applied: 65
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