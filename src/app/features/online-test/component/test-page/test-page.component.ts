import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-test-page',
  standalone: false,
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
    private router: Router
  ) { }

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

  selectAnswer(questionIndex: number, optionIndex: number) {
    this.selectedAnswers[questionIndex] = optionIndex;
  }

  toggleCheckbox(questionIndex: number, optionIndex: number) {
    if (!this.selectedAnswers[questionIndex]) {
      this.selectedAnswers[questionIndex] = [];
    }
    const idx = this.selectedAnswers[questionIndex].indexOf(optionIndex);
    if (idx === -1) {
      this.selectedAnswers[questionIndex].push(optionIndex);
    } else {
      this.selectedAnswers[questionIndex].splice(idx, 1);
    }
  }

  submitTest(): void {
  const answersPayload = this.questions
    .map((q, index) => {
      const answer = this.selectedAnswers[index];

      if (answer === null || answer === undefined || 
         (Array.isArray(answer) && answer.length === 0)) {
        return null;
      }

      return {
        questionId: q._id,
        selectedAnswers: Array.isArray(answer) ? answer : [answer]
      };
    })
    .filter(item => item !== null);

  if (answersPayload.length === 0) {
    alert('Please answer at least one question before submitting.');
    return;
  }

  this.commonHttpService.post(`test/submitTset/${this.testId}`, {
    answers: answersPayload
  }).subscribe({
    next: (res: any) => {
      this.router.navigate(['/online-test/test-result'], {
        queryParams: {
          status: res.status,
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

  return this.selectedAnswers.some((answer, index) => {
    const question = this.questions[index];

    if (question.type === 'textarea') {
      return !answer || answer.trim() === '';
    }

    if (question.type === 'checkbox') {
      return !Array.isArray(answer) || answer.length === 0;
    }

    // For radio (single choice), answer should be a valid number (index)
    return answer === null || answer === undefined;
  });
}


}