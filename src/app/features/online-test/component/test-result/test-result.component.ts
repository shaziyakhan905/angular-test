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
      console .log(params)
    this.status = (params['status'] || '').toLowerCase().trim(); // ✅ Clean input
    this.score = parseFloat(params['score'] || '0');
    this.message = params['message'];
    this.testId = params['testId'] || '';
    console.log('Status:', this.status); // 👈 check what it's actually receiving

     // ✅ Store testId in localStorage
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    if (!completedTests.includes(this.testId)) {
      completedTests.push(this.testId);
      localStorage.setItem('completedTests', JSON.stringify(completedTests));
    }
  });
  }

  retakeTest() {
    this.router.navigate(['/online-test/test-page'], {
      queryParams: { testId: this.testId }
    });
  }

}
