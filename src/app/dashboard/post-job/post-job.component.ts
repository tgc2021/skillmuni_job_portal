import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit {
  jobForm!: FormGroup;
  currentStep = 1; // Step indicator, starts with Job Overview

  // Dropdown lists (sample data)
  industryList = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'];
  categoryList = ['IT', 'Sales', 'Marketing', 'HR', 'Operations'];
  jobTypeList = ['Full Time', 'Part Time', 'Internship', 'Contract'];
  workModeList = ['Onsite', 'Remote', 'Hybrid'];
  openingsList = ['1', '2', '3', '4', '5+'];
  experienceList = ['0-1 years', '1-3 years', '3-5 years', '5+ years'];
  countryList = ['India', 'United States', 'United Kingdom', 'Australia', 'Canada'];
  cityList = ['Mumbai', 'Delhi', 'Bangalore', 'New York', 'London', 'Sydney'];

  // Dropdown state
  industryDropdownOpen = false;
  categoryDropdownOpen = false;
  jobTypeDropdownOpen = false;
  workModeDropdownOpen = false;
  openingsDropdownOpen = false;
  experienceDropdownOpen = false;
  countryDropdownOpen = false;
  cityDropdownOpen = false;

  // Selected values
  selectedIndustry = '';
  selectedCategory = '';
  selectedJobType = '';
  selectedWorkMode = '';
  selectedOpenings = '';
  selectedExperience = '';
  selectedCountry = '';
  selectedCity = '';

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnInit() {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      jobRole: ['', Validators.required],
      industry: ['', Validators.required],
      category: ['', Validators.required],
      jobType: ['', Validators.required],
      workMode: ['', Validators.required],
      openings: [''],
      experience: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      expirationDate: ['', Validators.required],
      salary: [''],
      careerFest: ['No', Validators.required]
    });
  }

  // Dropdown toggles
  toggleIndustryDropdown() { this.industryDropdownOpen = !this.industryDropdownOpen; this.closeOtherDropdowns('industry'); }
  toggleCategoryDropdown() { this.categoryDropdownOpen = !this.categoryDropdownOpen; this.closeOtherDropdowns('category'); }
  toggleJobTypeDropdown() { this.jobTypeDropdownOpen = !this.jobTypeDropdownOpen; this.closeOtherDropdowns('jobType'); }
  toggleWorkModeDropdown() { this.workModeDropdownOpen = !this.workModeDropdownOpen; this.closeOtherDropdowns('workMode'); }
  toggleOpeningsDropdown() { this.openingsDropdownOpen = !this.openingsDropdownOpen; this.closeOtherDropdowns('openings'); }
  toggleExperienceDropdown() { this.experienceDropdownOpen = !this.experienceDropdownOpen; this.closeOtherDropdowns('experience'); }
  toggleCountryDropdown() { this.countryDropdownOpen = !this.countryDropdownOpen; this.closeOtherDropdowns('country'); }
  toggleCityDropdown() { this.cityDropdownOpen = !this.cityDropdownOpen; this.closeOtherDropdowns('city'); }

  closeOtherDropdowns(open: string) {
    this.industryDropdownOpen = open === 'industry' ? this.industryDropdownOpen : false;
    this.categoryDropdownOpen = open === 'category' ? this.categoryDropdownOpen : false;
    this.jobTypeDropdownOpen = open === 'jobType' ? this.jobTypeDropdownOpen : false;
    this.workModeDropdownOpen = open === 'workMode' ? this.workModeDropdownOpen : false;
    this.openingsDropdownOpen = open === 'openings' ? this.openingsDropdownOpen : false;
    this.experienceDropdownOpen = open === 'experience' ? this.experienceDropdownOpen : false;
    this.countryDropdownOpen = open === 'country' ? this.countryDropdownOpen : false;
    this.cityDropdownOpen = open === 'city' ? this.cityDropdownOpen : false;
  }

  // Dropdown selects
  selectIndustry(industry: string) { this.selectedIndustry = industry; this.jobForm.get('industry')?.setValue(industry); this.industryDropdownOpen = false; }
  selectCategory(category: string) { this.selectedCategory = category; this.jobForm.get('category')?.setValue(category); this.categoryDropdownOpen = false; }
  selectJobType(type: string) { this.selectedJobType = type; this.jobForm.get('jobType')?.setValue(type); this.jobTypeDropdownOpen = false; }
  selectWorkMode(mode: string) { this.selectedWorkMode = mode; this.jobForm.get('workMode')?.setValue(mode); this.workModeDropdownOpen = false; }
  selectOpenings(opening: string) { this.selectedOpenings = opening; this.jobForm.get('openings')?.setValue(opening); this.openingsDropdownOpen = false; }
  selectExperience(exp: string) { this.selectedExperience = exp; this.jobForm.get('experience')?.setValue(exp); this.experienceDropdownOpen = false; }
  selectCountry(country: string) { this.selectedCountry = country; this.jobForm.get('country')?.setValue(country); this.countryDropdownOpen = false; }
  selectCity(city: string) { this.selectedCity = city; this.jobForm.get('city')?.setValue(city); this.cityDropdownOpen = false; }

  onSubmit() {
    if (this.jobForm.valid) {
      // Move to Step 2: Skills & Details
      this.currentStep = 2;
    } else {
      this.jobForm.markAllAsTouched();
    }
  }

  // Method to move to the next step (Skills & Details)
  onNextStep() {
    this.currentStep = 2; // Set currentStep to 2 to show Skills & Details step
  }

  onBackClick() {
    this.location.back();
  }
}
