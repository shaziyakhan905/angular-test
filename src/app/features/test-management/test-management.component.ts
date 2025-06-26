import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifiedService } from 'src/app/core/service/notified.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-test-management',
  templateUrl: './test-management.component.html',
  styleUrls: ['./test-management.component.scss']
})
export class TestManagementComponent implements OnInit {

  tests: any[] = [];
  totalTests: number = 0;
  page: number = 1;
  limit: number = 10;
  loading: boolean = false;
Math: any;

  constructor(
    private commonHttp: CommonHttpService,
    private router: Router,
    private notify:NotifiedService
  ) {}

  ngOnInit(): void {
    this.getAllTests();
  }

 getAllTests(): void {
  this.commonHttp.get('test').subscribe((res: any) => {
    this.tests = res.data;
  });
}

  goToCreateTest(): void {
    this.router.navigate(['/test-management/create-test']);
  }

  viewTest(testId: string): void {
   this.router.navigate(['/test-management/view-test', testId]);
  }

  updateTest(testId: string): void {
    this.router.navigate(['/test-management/create-test'], { queryParams: { testId } });
  }

  deleteTest(testId: string): void {
    if (confirm('Are you sure you want to delete this test?')) {
      this.commonHttp.delete(`test/deleteTest/${testId}`)
        .subscribe(() => {
          this.notify.showSuccess("test is Deleted Successfuly")
          this.getAllTests();
        });
    }
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.getAllTests();
  } 
  

}
