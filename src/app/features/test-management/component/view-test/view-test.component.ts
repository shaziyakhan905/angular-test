import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.scss']
})
export class ViewTestComponent implements OnInit {

  test: any;
  loading = false;
  testId!: string;

  constructor(
    private route: ActivatedRoute,
    private commonHttp: CommonHttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id') || '';
    if (this.testId) {
      this.getTestDetails();
    }
  }

  getTestDetails(): void {
    this.loading = true;
    this.commonHttp.get(`test/getSingleTest/${this.testId}`).subscribe({
      next: (res: any) => {
        this.test = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/test-management']);
  } 

}
