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

  constructor(
    private route: ActivatedRoute,
    private http: CommonHttpService,
    private router:Router
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
    });
  }

  goToTest(testId: string): void {
  this.router.navigate(['/online-test/test-page'], {
    queryParams: { testId }
  });
}

}
