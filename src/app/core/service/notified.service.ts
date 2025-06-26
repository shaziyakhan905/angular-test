import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifiedService {

  constructor(private toastr: ToastrService) { }
  showSuccess(message: string, title?: string) {
    this.toastr.success(message, title);
  }

  showError(message: string, title?: string) {
    this.toastr.error(message, title);
  }

  showWarrning(message: string, title?: string) {
    this.toastr.warning(message, title);
  }
}
