import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-online-test',
  standalone:false,
  templateUrl: './online-test.component.html',
  styleUrls: ['./online-test.component.scss']
})
export class OnlineTestComponent implements OnInit {
  showSidebar: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      // Hide sidebar on these pages
      this.showSidebar = !(
        currentUrl.includes('test-result') || currentUrl.includes('test-page')
      );
    });
  }

}
