import { Component } from '@angular/core';

@Component({
  selector: 'app-new-movie-container',
  templateUrl: './new-movie-container.component.html',
  styleUrls: ['./new-movie-container.component.scss']
})
export class NewMovieContainerComponent {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  constructor(){
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Add New Movie', active: true }
    ];  }
}
