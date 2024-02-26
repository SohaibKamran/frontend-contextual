import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { ApiService } from 'src/app/core/services/api.service';
import { requests } from 'src/app/core/config/config';
import { ToastrService } from 'ngx-toastr';
import { AnnotatorsFilterComponent } from 'src/app/shared/annotators-filter/annotators-filter.component';
import { DownloadDatabaseModalComponent } from '../download-database-modal/download-database-modal.component';
@Component({
  selector: 'app-database-dashboard',
  templateUrl: './database-dashboard.component.html',
  styleUrls: ['./database-dashboard.component.scss']
})
export class DatabaseDashboardComponent {
  seriesTitle = "Progress By Series"
  seriesClass = "dashboard-series"
  advertiserClass = "database-card-height"
  searchText: string
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  constructor(private modalService: NgbModal, private router: Router, private databaseService: DatabaseService,
    private toastrService: ToastrService,
    private apiService: ApiService) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Database', active: true },
    ];
  }
  open() {
    const modalRef = this.modalService.open(AnnotatorsFilterComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: false,
      centered: true,
    })
    modalRef.componentInstance.screen = 'Database'
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      // console.log("-==================>", receivedEntry)
      // this.$annotatorFilter.next(receivedEntry)
      this.databaseService.databaseRecords.next(receivedEntry)
      this.modalService.dismissAll()
    })
  }
  searchDatabase() {
    const body = {
      pageNo: 1,
      limit: 10,
      searchText: this.searchText
    }
    this.databaseService.nameSearch.next(this.searchText)
    this.databaseService.databaseRecords.next(body)
    this.router.navigate(['/database/filtered'])
  }
  openDatabaseModal(){
    this.modalService.open((DownloadDatabaseModalComponent),{
      windowClass: "modal-sm",
      backdrop: "static",
      keyboard: false,
      centered: true,  
    })
  }
}

