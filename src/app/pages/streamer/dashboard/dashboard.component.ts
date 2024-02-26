import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showApiKey = false;
  toggleText(){
    this.showApiKey = !this.showApiKey
  }
}
