import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-test-list',
  standalone:false,
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
 tests: any[] = [];
  filteredTests: any[] = [];
  selectedLevel: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: CommonHttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      if (categoryId) {
        this.fetchTestsByCategory(categoryId);
      }
    });
  }
  

  fetchTestsByCategory(categoryId: string) {
    this.http.get(`test/alltestWithCategaries/${categoryId}`).subscribe((res: any) => {
      this.tests = res.data;
      this.filteredTests = [...this.tests]; // default to all
    });
  }

  filterTestsByLevel() {
    if (this.selectedLevel) {
      this.filteredTests = this.tests.filter(
        test => test.level?.toLowerCase() === this.selectedLevel.toLowerCase()
      );
    } else {
      this.filteredTests = [...this.tests];
    }
  }

  resetLevelFilter() {
    this.selectedLevel = '';
    this.filteredTests = [...this.tests];
  }

  goToTest(testId: string): void {
    this.router.navigate(['/dashboard/test/online-test/test-page'], {
      queryParams: { testId }
    });
  }

}
