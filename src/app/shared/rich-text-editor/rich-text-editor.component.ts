import { Component, Input, HostListener, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  standalone: true,
  selector: 'app-rich-text-editor',
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichTextEditorComponent),
    multi: true
  }]
})
export class RichTextEditorComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = 'Description';
  @Input() placeholder: string = 'Write your content here...';
  @Input() minHeight: string = '200px'; // default height
  @Input() maxHeight: string = '80vh';  // for fullscreen
  @Input() set modules(value: any) {
    this._modules = value ?? this.defaultModules;
  }

  get modules(): any {
    return this._modules;
  }

  private _modules: any;
  isFullscreen = false;
  value = '';

  get editorHeight(): string {
    return this.isFullscreen ? this.maxHeight : this.minHeight;
  }

readonly defaultModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['code-block'],  // <-- Add this line to enable code block support
    ['clean']
  ]
};

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {}

  writeValue(val: any): void {
    this.value = val || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isFullscreen = false;
  }
}
