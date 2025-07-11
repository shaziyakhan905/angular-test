import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import hljs from 'highlight.js';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements AfterViewInit, OnChanges {
  @Input() course: any = null;
  @Output() back = new EventEmitter<void>();

  ngAfterViewInit() {
    this.highlightCode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      setTimeout(() => this.highlightCode(), 200);  // slight delay to ensure DOM is updated
    }
  }

  goBack() {
    this.back.emit();
  }

  highlightCode() {
      // Wrap <pre class="ql-syntax">...</pre> in <code> if needed
      document.querySelectorAll('pre.ql-syntax').forEach((pre: any) => {
        if (!pre.querySelector('code')) {
          const code = document.createElement('code');
          code.innerHTML = pre.innerHTML;
          code.className = 'language-typescript'; // or use 'language-javascript', etc.
          pre.innerHTML = '';
          pre.appendChild(code);
        }
      });

      // Now apply highlight.js
      document.querySelectorAll('pre code').forEach((block: any) => {
        hljs.highlightElement(block);
      });
    }
}
