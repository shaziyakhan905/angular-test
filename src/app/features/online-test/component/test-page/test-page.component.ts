import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-test-page',
  standalone:false,
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
  testId: string = '';
  testData: any;
  questions: any[] = [];
  selectedAnswers: any[] = [];

   resultMessage: string = '';
  resultStatus: 'pass' | 'fail' | '' = '';
  score: number = 0;

  constructor(
    private route: ActivatedRoute,
    private commonHttpService: CommonHttpService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.testId = params['testId'];
      if (this.testId) {
        this.loadTest();
      }
    });
  }

  loadTest(): void {
    this.commonHttpService.get(`test/${this.testId}`).subscribe((res: any) => {
      this.testData = res.data.test;
      this.questions = res.data.questions;
      console.log(this.questions)
      this.selectedAnswers = new Array(this.questions.length).fill(null);
    });
  }

 selectAnswer(index: number, value: string) {
    this.selectedAnswers[index] = value;
  }

  toggleCheckbox(index: number, value: string) {
    if (!this.selectedAnswers[index]) {
      this.selectedAnswers[index] = [];
    }
    const idx = this.selectedAnswers[index].indexOf(value);
    if (idx === -1) {
      this.selectedAnswers[index].push(value);
    } else {
      this.selectedAnswers[index].splice(idx, 1);
    }
  }

submitTest(): void {
  const answersPayload = this.questions
    .map((q, index) => {
      const answer = this.selectedAnswers[index];

      // Skip if user didn't answer the question
      if (answer === null || answer === undefined || 
         (Array.isArray(answer) && answer.length === 0)) {
        return null;
      }

      return {
        questionId: q._id,
        selectedAnswers: Array.isArray(answer) ? answer : [answer]
      };
    })
    .filter(item => item !== null); // Remove unanswered questions

  // ✅ Extra check to avoid sending empty payload
  if (answersPayload.length === 0) {
    alert('Please answer at least one question before submitting.');
    return;
  }

  this.commonHttpService.post(`test/submitTset/${this.testId}`, {
    answers: answersPayload
  }).subscribe({
    next: (res: any) => {
       // ✅ Navigate to test result page with query params
      const isPass = res.status === 'pass';

      this.router.navigate(['/online-test/test-result'], {
        queryParams: {
          status: isPass ? 'pass' : 'fail',
          score: res.score,
          message: res.message,
          testId: this.testId
        }
      });
    },
    error: (err) => {
      this.router.navigate(['/online-test/test-result'], {
        queryParams: {
          status: 'fail',
          score: err.error?.score || 0,
          message: err.error?.message || 'Unexpected error occurred',
          testId: this.testId
        }
      });
    }
    
  });
}

isSubmitDisabled(): boolean {
  if (this.questions.length === 0) return true;

  // Check if every question is answered
  return this.selectedAnswers.some(answer => {
    if (Array.isArray(answer)) {
      return answer.length === 0;
    }
    return answer === null || answer === undefined || answer === '';
  });
}

}