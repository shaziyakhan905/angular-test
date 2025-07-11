import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-children',
  templateUrl: './category-children.component.html',
  styleUrls: ['./category-children.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class CategoryChildrenComponent implements OnInit {
  @Input() children: any[] = [];
  @Input() canChange = false;
  @Output() categorySelected = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  categorySearchTerm: string = '';
  filteredChildren: any[] = [];
  toggleStates: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.filteredChildren = [...this.children];
  }

  onSearchCategory() {
    const term = this.categorySearchTerm.toLowerCase();
    this.filteredChildren = this.children.filter(cat =>
      cat.name.toLowerCase().includes(term)
    );
  }
  toggleCollapse(cat: any): void {
    if (!cat.navigable && cat.children?.length) {
      this.toggleStates[cat._id] = !this.toggleStates[cat._id];
    }
    this.select(cat); // Also emit the category selection if needed
  }

  select(cat: any) {
    this.categorySelected.emit(cat);
  }

}
