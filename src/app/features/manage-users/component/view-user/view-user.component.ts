import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
 userProfile: any = {};
  user: any;
  isAuthenticated$!: Observable<boolean>;
  constructor(private route: ActivatedRoute,
 private commonHttp: CommonHttpService,
private authService:AuthService) {}

  ngOnInit(): void {
     this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.authService.getUserProfile().subscribe(user => {
      this.userProfile = user;
    });
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.getUserDetails(userId);
    }
  }

  getUserDetails(userId: string): void {
    this.commonHttp.get(`user/getUserById/${userId}`).subscribe((res: any) => {
      this.user = res.user;
    });
  }

}
