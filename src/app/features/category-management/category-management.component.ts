import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifiedService } from 'src/app/core/service/notified.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
var bootstrap: any;
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
 categories: any[] = [];
  currentPage = 1;
  pageSize = 5;
  categoryForm!: FormGroup;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedCategoryId: string | null = null;

  @ViewChild('categoryModal') categoryModal: any;

  constructor(
    private commonHttp: CommonHttpService,
    private fb: FormBuilder,
    private notify:NotifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  getAllCategories(): void {
    this.commonHttp.get('test/getAllCategories').subscribe((res: any) => {
      this.categories = res.data;
    });
  }

  paginatedCategories(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.categories.slice(start, start + this.pageSize);
  }

  totalPagesArray(): number[] {
  return Array(Math.ceil(this.categories.length / this.pageSize)).fill(0).map((_, i) => i + 1);
}
get totalPages(): number {
  return Math.ceil(this.categories.length / this.pageSize);
}

  changePage(page: number): void {
    if (page < 1 || page > this.totalPagesArray().length) return;
    this.currentPage = page;
  }

  openModal(mode: 'create' | 'edit' | 'view', category: any = null): void {
    this.modalMode = mode;
    this.categoryForm.reset();
    this.selectedCategoryId = null;

    if (mode !== 'create' && category) {
      this.selectedCategoryId = category._id;
      this.categoryForm.patchValue({ name: category.name });
    }

    this.modalService.open(this.categoryModal, { backdrop: 'static' });
  }

  submitCategory(modal: any): void {
    if (this.categoryForm.invalid) return;

    const payload = { name: this.categoryForm.value.name };

    if (this.modalMode === 'create') {
      this.commonHttp.post('test/createCategory', payload).subscribe(() => {
        this.notify.showSuccess("Category is created successfyly")
        this.getAllCategories();
        modal.close();
      });
    } else if (this.modalMode === 'edit' && this.selectedCategoryId) {
      this.commonHttp.put(`test/updateTestCategory/${this.selectedCategoryId}`, payload).subscribe(() => {
        this.notify.showSuccess("Category is Updated successfyly")
        this.getAllCategories();
        modal.close();
      });
    }
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.commonHttp.delete(`test/deleteTestCategory/${id}`).subscribe(() => {
        this.notify.showError("Category is deleted successfyly")
        this.getAllCategories();
      });
    }
  }
}