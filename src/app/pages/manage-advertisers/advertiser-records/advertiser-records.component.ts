import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ROLES } from 'src/app/account/register/roles';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { ManageAdvertisersService } from '../manage-advertisers.service';
import { SharedService } from 'src/app/core/services/shared.service';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-advertiser-records',
  templateUrl: './advertiser-records.component.html',
  styleUrls: ['./advertiser-records.component.scss']
})

export class AdvertiserRecordsComponent implements OnInit {

  users = []
  advertisers = [];
  profilePicture: string;
  selectedIndex: any;
  tableHeadings = [{ name: "Advertiser", order: "" }, { name: "Total Products", order: "" }, { name: "Index Super-Proxies", order: "" }, { name: "Ad Inventory", order: "" }, { name: "Advertiser Status", order: "" }]
  backendHeadings = ["name", "productCount", "superProxyIndex", "adInventory", "retailerStatusId",]
  statuses = [];
  selectedItems = [];
  dropdownSettings: any = {};
  isChildActive = false;
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 100, pageNo: 1 }
  totalCount: any = 0;
  activeChildId: any = null;
  Statuses = []
  searchName: string = null
  body: any
  selectedFilter: any = null
  loader: boolean = false

  ngOnInit() {
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,

    }
    this.profilePicture = "https://storage.googleapis.com/contxtual-dev-bucket/images/ben-sweet-2LowviVHZ-E-unsplash.jpg";
    this.statuses = [
      { item_id: 1, text: 'Active', class: "approved" },
      { item_id: 2, text: 'Inactive', class: "returned" },
      { item_id: 3, text: 'Onboarding', class: 'onboarding'}
    ];
    this.Statuses = [
      {
        id: 1,
        title: "Active",
        class: "approved"
      },
      {
        id: 2,
        title: "Inactive",
        class: "returned"
      },
      {
        id: 3,
        title: "Onboarding",
        class: "onboarding"
      },
      
    ]
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
    };
    // this._fetchUserListing()
    this.fetchAdvertisers();
    //console.log("Advertisers")
    //console.log(this.fetchAdvertisers())
  }

  onItemSelect(item: any, userId: number) {
    // console.log('onItemSelect', item);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
  selectPage(page: string) {
    const tempPage = parseInt(page, 10) || 1;
    console.log(tempPage)
    console.log(this.totalCount / this.pagination.limit)
    if (tempPage <= Math.ceil(this.totalCount / this.pagination.limit)) {
      this.pagination.pageNo = tempPage
      this.body = {
        ...this.body,
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit,
      }
      this.fetchAdvertisers()
    }
  }
  onPageChange(event: any) {
    this.pagination.pageNo = event;
    console.log(event)
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,

    }
    this.fetchAdvertisers()
  }
  constructor(
    private apiService: ApiService,
    private advertiserService: ManageAdvertisersService,
    private sharedService: SharedService) { }

  setChild(index: any, id) {
    // console.log('onChildSelect', index);
    // console.log('on Select', id);
    this.selectedIndex = index == this.selectedIndex ? null : index;
    // this.isChildActive = index;
    this.activeChildId = id
    this.advertiserService.advertiserId = id;
  }
  deSelectAdvFilter($event) {
    this.body = {
      ...this.body,
      retailerStatusId: undefined
    }
    // console.log(this.selectedFilter)
    this.fetchAdvertisers()
  }


  // _fetchUserListing() {
  //   const data = {
  //     pageNo: this.pagination.pageNo,
  //     limit: this.pagination.limit,
  //     userType: ROLES.viewer
  //   }
  //   this.apiService.sendRequest(requests.getUserListing, 'post', data).subscribe((res: any) => {
  //     this.totalCount = res.data.count;
  //     this.users = res.data;
  //   })
  // }
  updateStatus($event: any, userId: number) {
    this.apiService.sendRequest(requests.getUpdateAdvertiser, 'post', {
      retailerStatusId: $event.id,
      retailerId: userId
    }).subscribe((res) => {
      // // console.log(res)
      this.fetchAdvertisers()
    })
  }
  filterUsingName() {
    if (this.searchName == "")
      this.body.name = undefined
    else
      this.body.name = this.searchName
    this.fetchAdvertisers()
  }
  fetchAdvertisers() {
    this.body={
      ...this.body,
      pageNo:this.pagination.pageNo,
      limit:this.pagination.limit
    }
    this.advertisers = []
    this.loader = true
    this.selectedItems = []
    this.apiService.sendRequest(requests.getAllAdvertisersForAdmin, 'post', this.body)
      .subscribe((res: any) => {
        this.loader = false
        // console.log("advertisers", res);
        this.advertisers = res?.data?.rows;
        this.totalCount = res?.data?.count
        //console.log(this.advertisers)
        for (let i = 0; i < this.advertisers.length; i++) {
          if (this.advertisers[i]?.retailerStatusId) {
            this.advertisers[i].status = { class: this.Statuses[this.advertisers[i]?.retailerStatusId - 1]?.class, title: this.Statuses[this.advertisers[i]?.retailerStatusId - 1]?.title }
            this.selectedItems.push(this.advertisers[i].status)
          }
          console.log(this.advertisers[i].status)
        }
        if (this.body.name) {
          this.body.name = undefined
        }
      })
  }
  filterUsingStatus(item: any) {
    console.log(item)
    this.body = { ...this.body, retailerStatusId: item?.item_id }
    console.log(this.body)
    this.fetchAdvertisers()
  }

  sort(order: number, heading: number) {
    this.tableHeadings = [{ name: "Advertiser", order: "" }, { name: "Total Products", order: "" }, { name: "Index Super-Proxies", order: "" }, { name: "Ad Inventory", order: "" }, { name: "Advertiser Status", order: "" }]
    let sortingOrder: string
    if (order == 1) {
      sortingOrder = "ASC"
      this.tableHeadings[heading].order = "ASC"
    }
    else {
      sortingOrder = "DESC"
      this.tableHeadings[heading].order = "DESC"
    }
    this.body.order = [[this.backendHeadings[heading], sortingOrder]]
    this.fetchAdvertisers()
  }
  closeModal(event) {
    this.selectedIndex = null
    if (event != 'Cancel')
      this.fetchAdvertisers()
  }
}
