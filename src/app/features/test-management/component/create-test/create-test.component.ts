import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifiedService } from 'src/app/core/service/notified.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {

  testForm!: FormGroup;
  categories: any[] = [];
  isEditMode: boolean = false;
  testId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: CommonHttpService,
    private notify: NotifiedService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.testForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
        level: ['', Validators.required],
      questions: this.fb.array([])
    });

    this.loadCategories();

    this.testId = this.route.snapshot.queryParamMap.get('testId');
    this.isEditMode = !!this.testId;

    if (this.isEditMode) {
      this.loadTestDetails(this.testId!);
    } else {
      this.addQuestion();
    }
  }

  get questions(): FormArray {
    return this.testForm.get('questions') as FormArray;
  }

  getQuestionsOptions(questionIndex: number) {
    return (this.questions.at(questionIndex).get('options') as FormArray);
  }

  setRadioCorrectAnswer(questionIndex: number, optionIndex: number) {
    const question = this.questions.at(questionIndex);
    question.get('correctAnswers')?.setValue([optionIndex]);
  }

  toggleCheckboxCorrectAnswer(questionIndex: number, optionIndex: number) {
    const question = this.questions.at(questionIndex);
    let correctAnswers = question.get('correctAnswers')?.value || [];

    if (correctAnswers.includes(optionIndex)) {
      correctAnswers = correctAnswers.filter((idx: number) => idx !== optionIndex);
    } else {
      correctAnswers.push(optionIndex);
    }

    question.get('correctAnswers')?.setValue(correctAnswers);
  }

  addQuestion(prefillData?: any): void {
    const questionGroup = this.fb.group({
      type: [prefillData?.type || 'radio', Validators.required],
      questionText: [prefillData?.questionText || '', Validators.required],
      questionContent: [prefillData?.questionContent || ''],
      options: this.fb.array([]),
      correctAnswers: this.fb.control([]) // Ensure it's an array by default
    });

    // Push options
    if (prefillData?.options?.length) {
      prefillData.options.forEach((opt: string) => {
        (questionGroup.get('options') as FormArray).push(this.fb.control(opt));
      });
    } else {
      (questionGroup.get('options') as FormArray).push(this.fb.control(''));
    }

    this.questions.push(questionGroup);

    // Set correctAnswers AFTER adding the FormGroup to FormArray
    if (prefillData?.correctAnswers?.length >= 0) {
      const lastIndex = this.questions.length - 1;
      this.questions.at(lastIndex).get('correctAnswers')?.setValue(prefillData.correctAnswers);
    }
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number): void {
    this.getOptions(questionIndex).push(this.fb.control(''));
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  loadCategories(): void {
    this.http.get('test/getAllCategories').subscribe((res: any) => {
      this.categories = res.data;
    });
  }

  loadTestDetails(testId: string): void {
    this.http.get(`test/getSingleTest/${testId}`).subscribe({
      next: (res: any) => {
        const test = res.data;

        this.testForm.patchValue({
          title: test?.title,
          description: test?.description || '',
          category: test.category?._id || '',
          level: test.level || ''
        });

        // Clear existing questions if any
        this.questions.clear();

        test.questions.forEach((q: any) => {
          this.addQuestion({
            type: q.type,
            questionText: q.questionText,
            questionContent: q?.questionContent || "",
            options: q.options,
            correctAnswers: q.correctAnswers
          });
        });
      },
      error: (err) => {
        console.error(err);
        this.notify.showError('Failed to load test details');
        this.router.navigate(['/dashboard/test/test-management']);
      }
    });
  }

  onSubmit(): void {
    if (this.testForm.invalid) {
      this.testForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.testForm.value };

    formValue.questions.forEach((q: any) => {
      if (q.type === 'textarea') {
        // Remove options and correctAnswers for textarea
        delete q.options;
        delete q.correctAnswers;
      } else {
        // Ensure correctAnswers is an array of numbers (should be already)
        if (!Array.isArray(q.correctAnswers)) {
          q.correctAnswers = [];
        }

        // Remove empty options if accidentally present
        q.options = q.options.filter((opt: string) => opt && opt.trim() !== '');
      }
    });

    if (this.isEditMode) {
      this.updateTest(formValue);
    } else {
      this.createTest(formValue);
    }
  }

  createTest(payload: any): void {
    this.http.post('test/createTest', payload).subscribe({
      next: () => {
        this.notify.showSuccess('Test Created Successfully');
        this.router.navigate(['/dashboard/test/test-management']);
      },
      error: (err) => console.error(err)
    });
  }

  updateTest(payload: any): void {
    this.http.put(`test/updateTest/${this.testId}`, payload).subscribe({
      next: () => {
        this.notify.showSuccess('Test Updated Successfully');
        this.router.navigate(['/dashboard/test/test-management']);
      },
      error: (err) => console.error(err)
    });
  }
}