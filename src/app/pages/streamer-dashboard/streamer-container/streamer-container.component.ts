import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Subject } from 'rxjs';
import { AnnotatorsFilterComponent } from 'src/app/shared/annotators-filter/annotators-filter.component';

@Component({
  selector: 'app-streamer-container',
  templateUrl: './streamer-container.component.html',
  styleUrls: ['./streamer-container.component.scss']
})
export class StreamerContainerComponent {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  $videoFilter: Subject<any> = new Subject;
  screen = "Catalog"
  timedSearch: any
  constructor(private apiService: ApiService,
    public modalService: NgbModal) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Videos', active: true }
    ];
  }
  open(content?: any) {
    const modalRef = this.modalService.open(AnnotatorsFilterComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.screen = this.screen
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      console.log("-==================>", receivedEntry);
      this.$videoFilter.next(receivedEntry)
    })
  }
  monthFilter() {
    // Get a date object for the current time
    const d = new Date();

    // Set it to one month ago
    d.setMonth(d.getMonth() - 1);

    // Zero the time component
    d.setHours(0, 0, 0, 0);

    // Get the time value in milliseconds and convert to seconds
    // // console.log(d / 1000 | 0);
    this.$videoFilter.next({ date: { startDate: d.toISOString(), endDate: new Date().toISOString() }, pageNo: 1, limit: 10 })
  }
  weekFilter() {
    const d = new Date();

    // Set it to one month ago
    d.setDate(d.getDate() - 7)

    // Zero the time component
    d.setHours(0, 0, 0, 0);

    // Get the time value in milliseconds and convert to seconds
    // // console.log(d / 1000 | 0);
    this.$videoFilter.next({ date: { startDate: d.toISOString(), endDate: new Date().toISOString() }, pageNo: 1, limit: 10 })
  }
  all() {
    this.$videoFilter.next({ pageNo: 1, limit: 10 })


  }


  seasonsList(data: any) {
    clearTimeout(this.timedSearch)
    this.timedSearch = setTimeout(() => {
      let seriesName = data.target.value;
      seriesName = seriesName?.trim()
      // console.log(seriesName);
      let body = {}
      seriesName !== "" ? body = {
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit,
        seriesName: seriesName,
      } :
        body = {
          pageNo: this.pagination.pageNo,
          limit: this.pagination.limit
        }
      this.$videoFilter.next(body)
    }, 200)
  }
}
