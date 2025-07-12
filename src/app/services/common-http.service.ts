import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonHttpService {
  
  private baseUrl = 'http://localhost:8080/api/';
  // private baseUrl = 'https://myfirstapp-api-v1en.onrender.com/api/'; // 👈 Change to your backend base URL

  constructor(private http: HttpClient) {}

  // Generic GET
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${endpoint}`)
   
    }

  // Generic POST
  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, data);
  }

  // Generic PUT
  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${endpoint}`, data);
  }

  // Generic DELETE
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endpoint}`);
  }
}
