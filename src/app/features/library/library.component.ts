import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent {
  categoryTree: any[] = [];
  canChange:boolean = false;
  
  constructor(
    private commonHttp: CommonHttpService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private authService: AuthService
  ) {
   this.getRole();
  }

  ngOnInit() {
    this.getLibraryCategories();
  }

    getRole() {
    this.authService.userRole$.subscribe((role: any) => {
      if (role != null) {
        if (role === 'admin') {
          this.canChange = true;
        }
      }
    });
  }

  getLibraryCategories() {
    this.commonHttp.get('library/categories/allCategoryTree').subscribe((response: any) => {
      this.categoryTree = response;
    }, (error) => {
      console.log(error);
    });
  }

  selectCategory(cat: any) {
    if (cat.navigable) {
      this.router.navigate([`/dashboard/library/course/${cat._id}`]);
    }
  }
}
