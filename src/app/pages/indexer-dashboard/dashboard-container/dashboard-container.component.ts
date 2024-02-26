import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {

  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  userName: string;


  ngOnInit(): void {
    this.userName = localStorage.getItem('user');
  }


  constructor(){

    this.breadCrumbItems = [
      { label: 'Indexing' },
      { label: 'Dashboard', active: true },
    ];

  }
}
