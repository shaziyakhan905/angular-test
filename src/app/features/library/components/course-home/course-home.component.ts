import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-course-home',
  templateUrl: './course-home.component.html',
  styleUrls: ['./course-home.component.scss']
})
export class CourseHomeComponent implements OnInit {
  @ViewChild('courseModal', { static: true }) courseModal: any;
  courseForm: FormGroup;
  categoryTree: any[] = [];
  courses: any[] = [];
  selectedCategory: any;
  selectedCourse: any = null;
  selectedCategoryHierarchy: any[] = [];

  categoryModalData: any = {};
  courseModalData: any = {};
  quillModules: any = {};
  isCourseIsInViewMode: boolean = false;
  courseViewMode: string = "";
  canChange: boolean = false;
  selectedCategoryId:string = "";
  constructor(
    private aRoute: ActivatedRoute,
    private commonHttp: CommonHttpService,
    private modalService: NgbModal,
    private router: Router,
    private authService:AuthService
  ) {

    this.getRole();
    this.aRoute.params.subscribe((params: Params) => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.getCategoryTreeByCatId(categoryId); // Pass categoryId
      }
    });

    this.courseForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      categoryId: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
    });

    this.aRoute.queryParams.subscribe((qparams: any) => {
      if ('categoryId' in qparams) {
        this.selectedCategoryId = qparams?.categoryId;
        this.getCoursesByCategoryId(qparams?.categoryId);
      }
    });
  }

  ngOnInit(): void { }

  get getCategoryName(): string {
    return this.selectedCategory?.name || this.courseModalData?.categoryId?.name || '';
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

  findCategoryById(tree: any[], categoryId: string): any {
    for (const node of tree) {
      if (node._id === categoryId) {
        return node;
      }

      if (node.children?.length) {
        const found = this.findCategoryById(node.children, categoryId);
        if (found) {
          return found;
        }
      }
    }

    return [];
  }

  buildCategoryHierarchy(category: any): any[] {
    const path = [];
    let current = category;

    while (current) {
      path.unshift({ _id: current._id, name: current.name });
      current = current.parent;
    }

    return path;
  }

  setParentReference(nodes: any[], parent: any = null): void {
    nodes.forEach(node => {
      node.parent = parent;
      if (Array.isArray(node.children) && node.children.length) {
        this.setParentReference(node.children, node);
      }
    });
  }

  getCategoryTreeByCatId(parentCatId: string): void {
    this.commonHttp.get(`library/categories/${parentCatId}/tree`).subscribe({
      next: (response: any) => {
        this.categoryTree = Array.isArray(response) ? response : [response];
        // this.setParentReference(this.categoryTree); // Set parent links
      },
      error: (err) => console.error(err)
    });
  }


  getRecentlyAddedCourses(): void {
    this.commonHttp.get('library/courses').subscribe({
      next: (response: any) => {
        this.courses = Array.isArray(response) ? response : [];
      },
      error: (err) => console.error(err)
    });
  }

  getCoursesByCategoryId(categoryId: string): void {
    this.commonHttp.get(`library/courses/byCategory/${categoryId}`).subscribe({
      next: (response: any) => {
        this.courses = Array.isArray(response) ? response : [];
        this.courseViewMode = "list";
      },
      error: (err) => console.error(err)
    });
  }

  selectCategory(cat: any): void {
    this.selectedCategory = cat;
    this.selectedCategoryHierarchy = this.buildCategoryHierarchy(cat);
    if (!Array.isArray(cat?.children) || cat.children.length === 0) {
      this.router.navigate([], {
        queryParams: {
          categoryId: cat._id,
        },
        queryParamsHandling: 'merge' // merges with existing query params
      });
    }
  }

  clearSelection(): void {
    this.selectedCourse = null;
    this.courseViewMode = "list";
  }

  openCourseModal(action: string = "add"): void {
    if (action === "add") {
      this.courseModalData = {};
      this.courseForm.patchValue({
        categoryId: this.selectedCategory?._id || '',
        title: "",
        description: "",
        price: "",
      });
    } else if (action === "edit" && this.courseModalData) {
      const course = this.courseModalData;
      this.courseForm.patchValue({
        categoryId: course.categoryId?._id || '',
        title: course.title || '',
        description: course.description || '',
        price: course.price || '',
      });
    }
    this.courseModalData = { ...this.courseModalData, action };
    this.modalService.open(this.courseModal, {
      fullscreen: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  viewCourse(course: any): void {
    this.selectedCourse = course;
    this.courseViewMode = "view";
  }

  editCourse(course: any): void {
    this.courseModalData = course;
    this.openCourseModal("edit");
  }

  deleteCourse(course: any): void {
    if (confirm("Are you sure you want to delete this course?")) {
      this.commonHttp.delete(`library/courses/${course._id}`).subscribe({
        next: () => this.getCoursesByCategoryId(this.selectedCategory?._id),
        error: (err) => console.error(err)
      });
    }
  }

  saveCourse(action: string): void {
    if (this.courseForm.invalid) return;

    const payload = this.courseForm.value;

    if (action === "add") {
      this.commonHttp.post(`library/courses`, payload).subscribe({
        next: (response: any) => {
          this.getCoursesByCategoryId(response.categoryId);
          this.modalService.dismissAll();
        },
        error: (err) => console.error(err)
      });
    } else if (action === "edit" && this.courseModalData?._id) {
      this.commonHttp.put(`library/courses/${this.courseModalData._id}`, payload).subscribe({
        next: (response: any) => {
          this.getCoursesByCategoryId(response.categoryId);
          this.modalService.dismissAll();
        },
        error: (err) => console.error(err)
      });
    }
  }

  onSearch(searchText: string): void {
    this.searchCourses(searchText); // your search function
  }

  onClearSearch(): void {
    this.getCoursesByCategoryId(this.selectedCategoryId);
  }

  searchCourses(searchText: string): void {
    const categoryId = this.categoryTree[0]?._id;

    if (!categoryId) return;

    this.commonHttp.get(`library/courses/searchByCategory/${categoryId}?searchText=${searchText}`)
      .subscribe({
        next: (courses: any) => {
          this.courses = courses;
        },
        error: (err) => {console.error(err)}
      });
  }

  navigateToLibraryHomePage() {
    this.router.navigate(['/dashboard/library']);
  }
}
