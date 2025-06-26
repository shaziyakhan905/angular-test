import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userProfile$ = new BehaviorSubject<any>(null);
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  userRole$ = new BehaviorSubject<string | null>(null);
  isLoggedIn$ = this.isAuthenticated$.asObservable();
  profileSubject = new BehaviorSubject<any>(null);
  profile$ = this.profileSubject.asObservable();
  //private baseUrl = 'http://localhost:8080/api';
  private baseUrl = 'https://myfirstapp-api-v1en.onrender.com/api';

  constructor(private http: HttpClient, private router: Router) {
    // Check token on service initialization
    this.checkAuthOnInit();
  }

  login(data: { emailId: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, data).pipe(
    tap(res => {
      if (res.token && res.refreshToken) {
        localStorage.setItem('accessToken', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
      }
    })
  );;
  }
  refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  return this.http.post<any>(`${this.baseUrl}/refrashTokan`, { refreshToken }).pipe(
    tap(res => {
      if (res.accessToken) {
        localStorage.setItem('accessToken', res.accessToken);
      }
    })
  );
}


  logout() {
    localStorage.removeItem('token');
    this.setIsAuthenticated(false);
    this.userProfile$.next(null);
    this.userRole$.next(null);
    this.router.navigate(['/auth/login']);
  }

  setIsAuthenticated(status: boolean): void {
    this.isAuthenticated$.next(status);
  }

  isLoggeedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token') || "";
  }

  setUserProfile(data: any) {
    this.userProfile$.next(data);
    this.setIsAuthenticated(true);
  }

  getUserProfile() {
    return this.userProfile$.asObservable();
  }

  private checkAuthOnInit() {
    const token = this.getToken();
    this.setIsAuthenticated(!!token);
  }

  setUserProfileImg(user: any) {
    this.profileSubject.next(user);
    this.userProfile$.next(user);
  }

  getUserProfileFromStorage() {
    return this.profileSubject.getValue();
  }

  setUserRole() {
    this.userRole$.next(this.getRoleFromToken())
  }

  getRoleFromToken(): string {
    const decodedToken: any = jwtDecode(this.getToken());
    const role = decodedToken.roles;
    return role
  }
}
