import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Search...';
  @Input() debounceTime: number = 300;
  @Input() minLength: number = 2;

  @Output() search = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      filter((value:any) => value.length >= this.minLength || value.length === 0),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value.length >= this.minLength) {
        this.search.emit(value);
      } else if (value.length === 0) {
        this.cleared.emit();
      }
    });
  }

  clear(): void {
    this.searchControl.setValue('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
