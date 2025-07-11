import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  categories: any[] = [];
  isAdmin: boolean = true;
  menuTab: string = "userMenu";
  categoryIcons: any = {
    html: {
      url: 'https://cdn-icons-png.flaticon.com/512/732/732212.png',
      color: '#e34c26'
    },
    css: {
      url: 'https://cdn-icons-png.flaticon.com/512/732/732190.png',
      color: '#2965f1'
    },
    javascript: {
      url: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
      color: '#de0bf1'
    },
    typescript: {
      url: 'https://cdn-icons-png.flaticon.com/512/5968/5968381.png',
      color: '#007acc'
    },
    angular: {
      url: 'https://angular.io/assets/images/logos/angular/angular.png',
      color: '#dd1b16'
    },
    nodejs: {
      url: 'https://cdn-icons-png.flaticon.com/512/919/919825.png',
      color: '#68a063'
    },
    mongodb: {
      url: 'https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg',
      color: '#4db33d'
    }
  };

  adminMenuItems = [
    {
      label: 'Test Management',
      icon: 'bi-clipboard-data',
      action: () => this.goToTestManagement()
    },
    {
      label: 'Manage Users',
      icon: 'bi-people',
      action: () => this.goToManageUsers()
    },
    {
      label: 'Manage Categorie',
      icon: 'bi bi-tags',
      action: () => this.goToCategoryManagement()
    },
  ];

  isAuthenticated$!: Observable<boolean>;

  constructor(
    private commonHttpService: CommonHttpService,
    private router: Router,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.authService.userRole$.subscribe((role: any) => {
      if (role != null) {
        if (role === 'admin') {
          this.isAdmin = true;
          this.menuTab = 'adminMenu';
        }else{
           this.isAdmin = false;
        }
      } else {
        this.menuTab = 'userMenu';
      }
    });

    // ✅ Get all categories on load
    this.commonHttpService.get('test/getAllCategories').subscribe((res: any) => {
      this.categories = res.data
    })
  }
  getCategoryDetails(name: string) {
    const key = name.toLowerCase();
    return this.categoryIcons[key] || {
      url: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
      color: '#000'
    };
  }

  // ✅ Navigate using query params
  goToCategory(categoryId: string): void {
    this.router.navigate(['/dashboard/test/online-test/tests'], {
      queryParams: { category: categoryId }
    });

  }

  goToTestManagement(): void {
    this.router.navigate(['/dashboard/test/test-management']);
  }

  goToManageUsers(): void {
    this.router.navigate(['/dashboard/test/manage-users']);
  }

  changeSideMenu(menuTab: string) {
    this.menuTab = menuTab;
  }
   goToCategoryManagement(): void {
    this.router.navigate(['/dashboard/test/category-management']);
  }
}



