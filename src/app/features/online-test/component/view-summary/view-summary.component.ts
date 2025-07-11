import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-view-summary',
  templateUrl: './view-summary.component.html',
  styleUrls: ['./view-summary.component.scss']
})
export class ViewSummaryComponent  implements OnInit {
  testId: string = '';
  summaryData: any;
  summaryDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private commonHttp: CommonHttpService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.testId = params['testId'];
      this.fetchSummary();
    });
  }

  fetchSummary(): void {
    const rawAnswers = localStorage.getItem('submittedAnswers');
    if (!rawAnswers) {
      console.error('No submitted answers found in localStorage');
      return;
    }

    let answers;
    try {
      answers = JSON.parse(rawAnswers);
    } catch (e) {
      console.error('Failed to parse stored answers:', e);
      return;
    }

    if (!this.testId || !answers) {
      console.error('Missing testId or answers');
      return;
    }

    const mappedAnswers = answers.map((ans: any, index: number) => ({
      questionIndex: index,
      selectedOptions: ans.selectedAnswers
    }));

    this.commonHttp.post(`test/evaluateTest/${this.testId}`, {
      answers: mappedAnswers
    }).subscribe({
      next: (res: any) => {
        this.summaryData = res.result;
        this.summaryDetails = res.result.details;
      },
      error: (err) => {
        console.error('Evaluation failed:', err);
      }
    });
  }
   goBack(): void {
    this.router.navigate(['/dashboard/test/online-test/test-result'], {
      queryParams: { testId: this.testId }
    });
  }

  isCorrect(optionIndex: number, detail: any): boolean {
    return detail.correctAnswers.includes(optionIndex);
  }

  isUserSelected(optionIndex: number, detail: any): boolean {
    return detail.userSelectedAnswers.includes(optionIndex);
  }

}
