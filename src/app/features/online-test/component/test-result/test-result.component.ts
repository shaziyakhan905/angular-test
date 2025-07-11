import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss']
})
export class TestResultComponent implements OnInit {
  status: string = '';
  score: number = 0;
  testId: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
   this.route.queryParams.subscribe(params => {
      this.status = params['status'];
      this.score = +params['score'];
      this.message = params['message'];
      this.testId = params['testId'];
    });
  }

  retakeTest() {
    this.router.navigate(['/dashboard/test/online-test/test-page'], {
      queryParams: { testId: this.testId }
    });
  }
  
  showSummary() {
    this.router.navigate(['dashboard/test/online-test/view-summary'], {
      queryParams: { testId: this.testId }
    });
  }
 


}
