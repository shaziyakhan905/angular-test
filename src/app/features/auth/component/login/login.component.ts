import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private commonHttp: CommonHttpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  getUserInfo() {
    this.commonHttp.get('user/profile').subscribe((profile: any) => {
      this.authService.setUserProfile(profile.user);
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.getUserInfo();
        this.authService.setUserRole();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }

}
