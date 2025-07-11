import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  users: any[] = [];
  selectedUser: any = null;
  page: number = 1;

  constructor(private commonHttp: CommonHttpService, private router:Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.commonHttp.get('user/getAllUsers').subscribe((res: any) => {
      this.users = res.users;
    });
  }

  goToViewUser(userId: string): void {
  this.router.navigate([`/dashboard/test/manage-users/view-user/${userId}`]);
}

}
