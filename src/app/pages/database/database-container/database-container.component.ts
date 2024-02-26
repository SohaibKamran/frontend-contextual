import { Component, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, first, take, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DatabaseService } from '../database.service';
import { AnnotatorsFilterComponent } from 'src/app/shared/annotators-filter/annotators-filter.component';
const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-database-container',
  templateUrl: './database-container.component.html',
  styleUrls: ['./database-container.component.scss']
})
export class DatabaseContainerComponent implements OnDestroy {
  search : any
  seriesTitle = "Progress By Series"
  breadCrumbItems: ({ label: string; active?: undefined; url: string } | { label: string; active: boolean; url: string })[];
  isToggled: Boolean = true
  sortBy: any;
  selectedFilter: any
  nameSearch: string
  nameSearchObs: any
  body: any
  isAlive = new Subject<boolean>()
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 100, pageNo: 1 }
  constructor(
    public modalService: NgbModal,
    private sharedService: SharedService,
    private databaseService: DatabaseService
  ) {
    this.breadCrumbItems = [
      { label: 'Admin', url: '/database' },
      { label: 'Database', url: '/database' },
      { label: 'Filtered', active: true, url: '/database/filtered' },
    ];
  }
  cities = [];
  selectedItems = [];
  dropdownSettings: any = {};
  $videoFilter: Subject<any> = new Subject;
  totalCount = 0
  ngOnInit() {
    this.isAlive.next(true)
    this.getBody()
    this.fetchCount()
    this.sharedService.getStatuses()
    this.sortBy = [
      {
        id: 1,
        title: "New",
      },
      {
        id: 2,
        title: "Old"
      }
    ]
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
    };
    this.fetchName()
  }

  fetchName() {
    this.databaseService.nameSearch.pipe(take(1)).subscribe((res) => {
      if (res) {
        this.nameSearch = res
      }
    })
  }
  ngOnDestroy(): void {

  }
  timedSearch = () =>
  {
    clearTimeout(this.search)
    this.search = setTimeout(() =>
    {
      if (this.nameSearch != "") {
        this.body = {
          ...this.body,
          searchText: this.nameSearch,
          pageNo: this.pagination.pageNo,
          limit: this.pagination.limit
        }
      }
      else {
        this.body = {
          ...this.body,
          searchText: undefined,
          pageNo: this.pagination.pageNo,
          limit: this.pagination.limit
        }
      }
      this.databaseService.databaseRecords.next(this.body)
    },1000)
  }
  // searchByName() {
  //   if (this.nameSearch != "") {
  //     this.body = {
  //       ...this.body,
  //       searchText: this.nameSearch,
  //       pageNo: this.pagination.pageNo,
  //       limit: this.pagination.limit
  //     }
  //   }
  //   else {
  //     this.body = {
  //       ...this.body,
  //       searchText: undefined,
  //       pageNo: this.pagination.pageNo,
  //       limit: this.pagination.limit
  //     }
  //   }
  //   this.databaseService.databaseRecords.next(this.body)
  // }
  open(content?: any) {
    const modalRef = this.modalService.open(AnnotatorsFilterComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      console.log("-==================>", receivedEntry);
      this.$videoFilter.next(receivedEntry)
      modalRef.componentInstance.$videoFilter = this.$videoFilter
    })
  }
  toggleFilter(toggle) {
    this.isToggled = toggle
  }
  onItemSelect(item: any) {
    this.sortBy = item.item_id;
    // console.log('onItemSelect', item);
  }
  filterUsingStatus(item: any) {
    console.log(item)
    //this.body.retailerStatusId=item
    this.selectedFilter = this.sortBy[item - 1]
    this.databaseService.sortBy.next(item)
  }
  selectPage(page: string) {
    if(page!=(this.pagination.pageNo+"")){
    this.pagination.pageNo = parseInt(page);
    this.databaseService.databaseRecords.pipe(takeUntil(this.isAlive),first()).subscribe((res) => {
      if (res) {
        console.log(res)
        this.body = res
        this.body = {
          ...this.body,
          pageNo: page
        }
        this.databaseService.databaseRecords.next(this.body)
      }
    })
  }
  }
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
  onPageChange(event: any) {
    this.databaseService.databaseRecords.pipe(takeUntil(this.isAlive),first()).subscribe((res) => {
      if (res) {
        console.log(res)
        this.body = res
        this.body = {
          ...this.body,
          pageNo: event
        }
      }
      else {
        this.pagination.pageNo = 1
        this.pagination.limit = 100
        this.body = {
          pageNo: this.pagination.pageNo,
          limit: this.pagination.limit
        }
      }
      this.databaseService.databaseRecords.next(this.body)
    })
    // this.fetchCoordinateListingForAdmin()
  }
  changeLimit() {
    this.databaseService.databaseRecords.pipe(takeUntil(this.isAlive),first()).subscribe(async (res) => {
      if (res) {
        console.log(res)
        this.body = res
        this.body = await {
          ...this.body,
          limit: this.pagination.limit
        }
        this.databaseService.databaseRecords.next(this.body)
      }
    })
  }

  fetchCount() {
    this.databaseService.databaseCount.pipe(takeUntil(this.isAlive)).subscribe((res) => {
      if (res) {
        this.totalCount = res
        console.log(this.totalCount, "total count")
      }
      else {
        this.totalCount = 0
      }
    })
  }
  getBody() {
    this.databaseService.databaseRecords.pipe(takeUntil(this.isAlive)).subscribe((res) => {
      if (res) {
        console.log(res)
        this.body = res
        this.pagination.pageNo=this.body.pageNo
        this.pagination.limit=this.body.limit
      }
    })
  }
  OnDestroy(){
    this.isAlive.next(false)
  }
}
