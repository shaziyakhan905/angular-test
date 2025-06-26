import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userProfile: any = {};
  profileImageUrl = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  showDropdown = false;
  isAuthenticated$!: Observable<boolean>;

  constructor(
    private commonHttp: CommonHttpService,
    private authService: AuthService,
    private router: Router
  ) { 
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(user => {
      this.userProfile = user;
    });

    if (this.authService.isLoggeedIn()) {
      this.getUserInfo();
      this.authService.setUserRole();
    }

  }

  getUserInfo() {
    this.commonHttp.get('user/profile').subscribe((profile: any) => {
      this.userProfile = profile.user;
      this.authService.setUserProfile(profile.user);
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    this.router.navigate(['/auth/profile']);
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.showDropdown = false;
    }
  }
}
