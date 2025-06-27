import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifiedService } from 'src/app/core/service/notified.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditMode = false;
  profileImageUrl = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  imageError: string = '';

  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  userProfile: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commonHttp: CommonHttpService,
    private notify: NotifiedService
  ) { }

  ngOnInit(): void {
    this.loadCountries();
    this.fetchProfile();
  }

  fetchProfile() {
    this.commonHttp.get('user/profile').subscribe((res: any) => {
      const user = res.user;
      this.userProfile = user;
      this.initializeForm(user);
      if (user.country?._id) this.loadStates(user.country._id);
      if (user.state?._id) this.loadCities(user.state._id);
      this.profileImageUrl = user.profileImage?.dataUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
      this.authService.setUserProfile(user);
    });
  }

  initializeForm(user: any) {
    this.profileForm = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      mobileNo: [user.mobileNo, Validators.required],
      emailId: [user.emailId],
      country: [user.country?._id],
      state: [user.state?._id],
      city: [user.city?._id],
      skills: this.fb.array([])
    });

    if (user.skills?.length) {
      user.skills.forEach((skill: any) => {
        this.skills.push(this.createSkillGroup(skill));
      });
    }

    while (this.skills.length < 3) {
      this.addSkill();
    }
  }

  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  createSkillGroup(skill: any = { name: '', experience: '', level: '' }): FormGroup {
    return this.fb.group({
      name: [skill.name, Validators.required],
      experience: [skill.experience, [Validators.required, Validators.min(0)]],
      level: [skill.level, Validators.required]
    });
  }

  addSkill() {
    this.skills.push(this.createSkillGroup());
  }

  removeSkill(index: number) {
    if (this.skills.length > 3) {
      this.skills.removeAt(index);
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

  onCountryChange() {
    const countryId = this.profileForm.value.country;
    this.profileForm.patchValue({ state: '', city: '' });
    this.states = [];
    this.cities = [];
    if (countryId) {
      this.loadStates(countryId);
    }
  }

  onStateChange() {
    const stateId = this.profileForm.value.state;
    this.profileForm.patchValue({ city: '' });
    this.cities = [];
    if (stateId) {
      this.loadCities(stateId);
    }
  }

  loadCountries() {
    this.commonHttp.get('address/countries').subscribe((res: any) => {
      this.countries = res;
    });
  }

  loadStates(countryId: string) {
    this.commonHttp.get(`address/states/${countryId}`).subscribe((res: any) => {
      this.states = res;
    });
  }

  loadCities(stateId: string) {
    this.commonHttp.get(`address/cities/${stateId}`).subscribe((res: any) => {
      this.cities = res;
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    const payload = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      mobileNo: this.profileForm.value.mobileNo,
      skills: this.profileForm.value.skills,
      countryId: this.profileForm.value.country,
      stateId: this.profileForm.value.state,
      cityId: this.profileForm.value.city
    };

    this.commonHttp.put('user/updateUserProfile', payload).subscribe({
      next: () => {
        this.isEditMode = false;
        this.fetchProfile();
        this.notify.showSuccess("Profile updated successfully!");
      },
      error: () => {
        this.notify.showError("Failed to update profile");
      }
    });
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      this.notify.showError('Only JPG, JPEG, GIF or PNG images are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.notify.showError('Image size should be less than 10MB');
      return;
    }

    const options = {
      maxSizeMB: 1, // Target maximum size in MB
      maxWidthOrHeight: 500, // Resize to 500x500 max, good for profile images
      useWebWorker: true
    };
    imageCompression(file, options)
      .then(compressedFile => {
        console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');
        console.log('Compressed size:', (compressedFile.size / 1024).toFixed(2), 'KB');

        // You can now upload compressedFile instead of original file
        this.uploadImage(compressedFile);
      })
      .catch(err => {
        console.error(err);
        this.notify.showError('Image compression failed');
      });

  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('profileImage', file);

    this.commonHttp.post('user/uploadProfile', formData).subscribe({
      next: (res: any) => {
        this.notify.showSuccess('Profile image updated successfully!');
        this.fetchProfile();
      },
      error: (err) => {
        console.error(err);
        this.notify.showError(err.error?.message || 'Image upload failed');
      }
    });
  }
}