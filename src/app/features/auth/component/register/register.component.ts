import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifiedService } from 'src/app/core/service/notified.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm!: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: CommonHttpService,
    private router: Router,
    private natify:NotifiedService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCountries();
  }

  buildForm(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      countryId: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required]
    });
  }

  loadCountries(): void {
    this.http.get('address/countries').subscribe((res: any) => {
      this.countries = res;
    });
  }

  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCountryId = selectElement.value;

    this.registrationForm.patchValue({ stateId: '', cityId: '' });
    this.states = [];
    this.cities = [];

    if (selectedCountryId) {
      this.loadStates(selectedCountryId);
    }
  }

  loadStates(countryId: string): void {
    this.http.get(`address/states/${countryId}`).subscribe((res: any) => {
      this.states = res;
    });
  }

  onStateChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateId = selectElement.value;

    this.registrationForm.patchValue({ cityId: '' });
    this.cities = [];

    if (selectedStateId) {
      this.loadCities(selectedStateId);
    }
  }

  loadCities(stateId: string): void {
    this.http.get(`address/cities/${stateId}`).subscribe((res: any) => {
      this.cities = res;
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.http.post('createUser', this.registrationForm.value).subscribe({
      next: () => {
        this.natify.showSuccess('Registration successful! Please login.');
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}
