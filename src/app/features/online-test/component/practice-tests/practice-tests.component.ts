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
  filteredTests: any[] = [];
  categories: any[] = [];
  paginatedTests: any[] = [];

  selectedCategory: string = '';
  selectedLevel: string = '';
  levels: string[] = ['Beginner', 'Intermediate', 'Expert'];
  page: number = 1;

  constructor(private http: CommonHttpService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTests();
    this.getAllCategories();
  }

  getAllTests() {
    this.http.get('test').subscribe((res: any) => {
      this.tests = res.data;
      this.filterTests(); // Apply filter initially
    });
  }

  getAllCategories() {
    this.http.get('test/getAllCategories').subscribe((res: any) => {
      this.categories = res.data;
    });
  }

 filterTests(): void {
  this.page = 1;
  this.filteredTests = this.tests.filter(test => {
    const matchCategory = this.selectedCategory
      ? test.category === this.selectedCategory // ✅ FIXED here
      : true;
    const matchLevel = this.selectedLevel
      ? test.level === this.selectedLevel
      : true;
    return matchCategory && matchLevel;
  });
}
  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedLevel = '';
    this.filterTests();
  }

  startTest(testId: string): void {
    this.router.navigate(['/dashboard/test/online-test/test-page'], {
      queryParams: { testId }
    });
  }

}
