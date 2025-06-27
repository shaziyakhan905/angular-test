import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone:false,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  isLoading = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loaderState$.subscribe(state => {
      this.isLoading = state;
    });
  }
}
