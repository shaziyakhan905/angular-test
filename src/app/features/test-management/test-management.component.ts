import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifiedService } from 'src/app/core/service/notified.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-test-management',
  templateUrl: './test-management.component.html',
  styleUrls: ['./test-management.component.scss']
})
export class TestManagementComponent implements OnInit {
  @ViewChild('createTestModal') createTestModal: any;
  testForm: FormGroup;
  categories: any[] = [];
  tests: any[] = [];
  totalTests: number = 0;
  page: number = 1;
  limit: number = 10;
  loading: boolean = false;
  Math: any;
  selectedQuestionFile: File | null = null;

  constructor(
    private commonHttp: CommonHttpService,
    private router: Router,
    private notify: NotifiedService,
    private fb: FormBuilder,
    private http: CommonHttpService,
    private modalService: NgbModal
  ) {
    this.testForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllTests();
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get('test/getAllCategories').subscribe((res: any) => {
      this.categories = res.data;
    });
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

  openCreateTestModal() {
    this.modalService.open(this.createTestModal, { backdrop: 'static' });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Validate file type
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        alert('Only Excel files are allowed.');
        fileInput.value = ''; // Reset file input
        this.selectedQuestionFile = null;
        return;
      }

      this.selectedQuestionFile = file;
    }
  }

  createTest(): void {
    if (this.testForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('title', this.testForm.value.title);
    formData.append('category', this.testForm.value.category);

    if (this.selectedQuestionFile) {
      formData.append('file', this.selectedQuestionFile);
    } else {
      alert('Please select a valid Excel file.');
      return;
    }

    this.http.post('test/createTestFromExcel', formData).subscribe({
      next: () => {
        this.getAllTests();
        this.modalService.dismissAll();
        this.notify.showSuccess('Test Created Successfully');

      },
      error: (err) => {
        console.log(err)
        this.notify.showError(err.error.message || 'Failed to create test');
      }
    });


  }


}
