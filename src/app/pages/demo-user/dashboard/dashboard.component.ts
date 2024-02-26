import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  userName: string;
  constructor() {
    this.breadCrumbItems = [
      { label: 'Streamer Demo' },
      { label: 'Dashboard', active: true }
    ];
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user');

  }

}
