import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-practice-tests',
  templateUrl: './practice-tests.component.html',
  styleUrls: ['./practice-tests.component.scss']
})
export class PracticeTestsComponent implements OnInit {
  tests: any[] = [];
  paginatedTests: any[] = [];
completedTestIds: string[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
Math: any;
totalPages: any;

  constructor(private commonHttpService: CommonHttpService, private router: Router) {}

  ngOnInit(): void {

    this.fetchTests();
  this.completedTestIds = JSON.parse(localStorage.getItem('test/completedTests') || '[]');
   
  }

  fetchTests(){
 this.commonHttpService.get('test').subscribe((res: any) => {
      this.tests = res.data;
      this.updatePagination();
    });
  }

  isTestCompleted(testId: string): boolean {
  return this.completedTestIds.includes(testId);
}
  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTests = this.tests.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > Math.ceil(this.tests.length / this.pageSize)) return;
    this.currentPage = page;
    this.updatePagination();
  }

  startTest(testId: string): void {
    this.router.navigate(['/online-test/test-page'], {
      queryParams: { testId }
    });
  }

}
