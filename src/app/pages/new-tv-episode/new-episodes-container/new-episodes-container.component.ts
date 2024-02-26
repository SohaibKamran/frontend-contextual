import { Component } from '@angular/core';

@Component({
  selector: 'app-new-episodes-container',
  templateUrl: './new-episodes-container.component.html',
  styleUrls: ['./new-episodes-container.component.scss']
})
export class NewEpisodesContainerComponent {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  constructor(){
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Add New TV Episode', active: true }
    ];  }
}
