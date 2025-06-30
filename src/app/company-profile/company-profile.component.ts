import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Custom validator function for word count
function maxWordsValidator(max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const words = control.value.trim().split(/\s+/);
    return words.length > max ? { maxWords: { max, actual: words.length } } : null;
  };
}

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  logoError: boolean = false;
  profileForm!: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  showSuccessPopup: boolean = false;
  showExitWarningPopup: boolean = false;

  countryList = ['India', 'United States', 'United Kingdom', 'Australia', 'Canada'];
  cityList = ['Mumbai', 'Delhi', 'Bangalore', 'New York', 'London', 'Sydney'];
  industryList = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'];

  selectedCountry: string = '';
  selectedCity: string = '';
  selectedIndustry: string = '';

  countryDropdownOpen = false;
  cityDropdownOpen = false;
  industryDropdownOpen = false;

  constructor(private fb: FormBuilder, private location: Location, private router: Router) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      companyEmail: [{ value: '', disabled: true }],
      companyWebsite: ['', [
        Validators.required,
        Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$|^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d{1,5})?(?:\/[^\s]*)?$/i)
      ]],
      companyLogo: [null],
      country: ['', Validators.required],
      city: ['', Validators.required],
      industry: ['', Validators.required],
      size: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      about: ['', [maxWordsValidator(100)]]
    });
  
    this.selectedCountry = this.profileForm.get('country')?.value || '';
    this.selectedCity = this.profileForm.get('city')?.value || '';
    this.selectedIndustry = this.profileForm.get('industry')?.value || '';
  
    // Push state to history to detect manual back
    history.pushState(null, '', window.location.href);
  
    // Register popstate listener
    window.addEventListener('popstate', this.handleBrowserBack);
  }
  
  ngOnDestroy() {
    window.removeEventListener('popstate', this.handleBrowserBack);
  }
  
  // Must be arrow function to preserve `this` context
  handleBrowserBack = (event: PopStateEvent) => {
    if (!this.profileForm.valid && !this.showExitWarningPopup) {
      this.showExitWarningPopup = true;
  
      // Push state again to block actual back
      history.pushState(null, '', window.location.href);
    }
  };
  

  exitAnyway() {
    this.showExitWarningPopup = false;
    this.location.back(); // allow browser back
  }

  keepEditing() {
    this.showExitWarningPopup = false;
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.logoError = true;
        this.logoPreview = null;
        this.profileForm.patchValue({ companyLogo: null });
        return;
      } else {
        this.logoError = false;
        const reader = new FileReader();
        reader.onload = () => (this.logoPreview = reader.result);
        reader.readAsDataURL(file);
        this.profileForm.patchValue({ companyLogo: file });
      }
    } else {
      this.logoError = false;
      this.logoPreview = null;
      this.profileForm.patchValue({ companyLogo: null });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.showSuccessPopup = true;
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  // Dropdowns
  toggleCountryDropdown() {
    this.countryDropdownOpen = !this.countryDropdownOpen;
    this.cityDropdownOpen = false;
    this.industryDropdownOpen = false;
  }

  toggleCityDropdown() {
    this.cityDropdownOpen = !this.cityDropdownOpen;
    this.countryDropdownOpen = false;
    this.industryDropdownOpen = false;
  }

  toggleIndustryDropdown() {
    this.industryDropdownOpen = !this.industryDropdownOpen;
    this.countryDropdownOpen = false;
    this.cityDropdownOpen = false;
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.profileForm.get('country')?.setValue(country);
    this.countryDropdownOpen = false;
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.profileForm.get('city')?.setValue(city);
    this.cityDropdownOpen = false;
  }

  selectIndustry(industry: string) {
    this.selectedIndustry = industry;
    this.profileForm.get('industry')?.setValue(industry);
    this.industryDropdownOpen = false;
  }

  goToDashboard() {
    this.showSuccessPopup = false;
    this.router.navigate(['/dashboard']);
  }

  get aboutWordCount(): number {
    const aboutText = this.profileForm.get('about')?.value || '';
    return aboutText.trim() ? aboutText.trim().split(/\s+/).length : 0;
  }

  get isWordCountExceeded(): boolean {
    return this.aboutWordCount > 100;
  }
}
