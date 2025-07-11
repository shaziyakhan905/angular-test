import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpService } from 'src/app/services/common-http.service';

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.scss']
})
export class CategorySidebarComponent {
  @Input() categoryTree: any[] = [];
  @Input() canChange:boolean = false;

  @Output() categorySelected = new EventEmitter<any>();
  @Output() categoryTreeChanged = new EventEmitter<any[]>(); // Optional: notify parent if needed

  @ViewChild('categoryModal', { static: true }) categoryModal: any;

  categoryForm: FormGroup;
  categoryModalData: any = {};

  constructor(
    private modalService: NgbModal,
    private commonHttp: CommonHttpService
  ) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
      parentCategoryName: new FormControl(''),
      parentCategoryId: new FormControl(''),
      navigable: new FormControl(false),
      description: new FormControl('')
    });
  }

  selectCategory(category: any): void {
    this.categorySelected.emit(category);
  }

  openAddModal(parent: any): void {
    this.categoryModalData = { action: 'add', parent };
    this.categoryForm.setValue({
      name: '',
      description: '',
      navigable: false,
      parentCategoryName: parent?.name || '',
      parentCategoryId: parent?._id || ''
    });
    this.modalService.open(this.categoryModal,{
      backdrop: 'static',
      keyboard: false
    });
  }

  openEditModal(category: any): void {
    this.categoryModalData = { action: 'edit', category };
    this.categoryForm.setValue({
      name: category.name,
      parentCategoryName: category.parent?.name || '',
      parentCategoryId: category.parent?._id || '',
      description: category?.description || '',
      navigable: category?.navigable || false,
    });
    this.modalService.open(this.categoryModal,{
      backdrop: 'static',
      keyboard: false
    });
  }

  deleteCategory(category: any, parentList: any[]): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.commonHttp.delete(`library/categories/${category._id}`).subscribe(() => {
        const index = parentList.findIndex(c => c._id === category._id);
        if (index !== -1) {
          parentList.splice(index, 1);
        }
        this.categoryTreeChanged.emit(this.categoryTree);
      }, (error) => {
        console.error('Delete failed:', error);
      });
    }
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;
    const formValue = this.categoryForm.value;
    const description = formValue.description;
    const navigable = formValue.navigable;
    const { action, category, parent } = this.categoryModalData;
    const name = this.categoryForm.value.name;
    const parentId = this.categoryForm.value.parentCategoryId || null;

    if (action === 'add') {
      const payload = { name, parentId, description,navigable };
      this.commonHttp.post('library/categories', payload).subscribe((newCategory: any) => {
        newCategory.children = [];
        newCategory.parent = parent || null;

        if (parent?.children) {
          parent.children.push(newCategory);
        } else {
          this.categoryTree.push(newCategory);
        }

        this.modalService.dismissAll();
        this.categoryTreeChanged.emit(this.categoryTree);
      }, (error) => {
        console.error('Add failed:', error);
      });

    } else if (action === 'edit') {
      const payload = { name, description,navigable, parentId };
      this.commonHttp.put(`library/categories/${category._id}`, payload).subscribe(() => {
        category.name = name;
        this.modalService.dismissAll();
        this.categoryTreeChanged.emit(this.categoryTree);
      }, (error) => {
        console.error('Edit failed:', error);
      });
    }
  }
}