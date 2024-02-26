import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ROLES } from 'src/app/account/register/roles';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
import { ManageAnnotatorsService } from '../manage-annotators.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-annotator-records',
  templateUrl: './annotator-records.component.html',
  styleUrls: ['./annotator-records.component.scss'],
  changeDetection:ChangeDetectionStrategy.Default
})
export class AnnotatorRecordsComponent {
  @Input() $annotatorFilter: Subject<any> = new Subject;
  taggers = [] as any
  tableHeadings = [{ name: "Annotator Name", class: "",order:"" }, { name: "Total Product Records", class: "",order:"" }, { name: "Avg VZoT", class: "", order:""}, { name: "To Do", class: "todo",order:"" }, { name: "In Progress", class: "inprogress", order:"" }, { name: "Returned", class: "returned",order:"" }, { name: "Approved", class: "approved",order:"" }, { name: "Employment Status", class: "",order:"" }]
  backendHeadings = ["fullName", "tagCount", "averageVzotScore", "scenesTodo", "scenesInprogress", "scenesReturned", "taggedScenesCount", "userStatusId"]
  statuses = [];
  selectedItems = [];
  dropdownSettings: any = {};
  isChildActive = false;
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 100, pageNo: 1 }
  totalCount: any = 21;
  activeChildId: any = null;
  body: any
  openModel: boolean = false
  nameSearchObservable
  monthObservable
  statusObservable
  taggerObservable
  name: string
  Statuses: any
  clicked = true
  loader: boolean = true
  annotatorId: number
  isAlive = new Subject()
  annotator:any
  ngOnInit() {
    this.isAlive.next(true)
    this.refreshAnnotators()
    this.annotator = JSON.parse(sessionStorage.getItem('tagger'));
    if (!this.annotator) {
      this.body = {
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit,
        userType: ROLES.tagger,
      }
    }
    else {
      console.log(this.annotator,"Annotator")
      sessionStorage.removeItem('tagger')
      this.pagination.pageNo = this.annotator.pageNo
      this.body = {
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit,
        userType: ROLES.tagger,
      }
      this.totalCount = this.annotator.count
    }

    this.Statuses = [
      {
        id:1,
        title: "Active",
        class: "approved"
      },
      {
        id:2,
        title: "Inactive",
        class: "returned"
      },
      {
        id:3,
        title: "Onboarding",
        class: "inprogress"
      },
    ]
    this.statuses = [
      { item_id: 1, item_text: 'Active' },
      { item_id: 2, item_text: 'Inactive' },
      { item_id: 3, item_text: 'Onboarding' },

    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
    };
    this.getFullName()
    this.getDate()
    this.getTaggerIds()
    this.getTaggerBody()
    this._fetchUserListing()

  }

  refreshObs:Subscription
  refreshAnnotators(){
    this.refreshObs=this.sharedService.userAdded.subscribe((res)=>{
      if(res){
        this._fetchUserListing()
      }
    })
  }
  getTaggerBody() {

    this.taggerObservable = this.$annotatorFilter.subscribe((res) => {
      if (res) {
        this.body = res
        this.pagination.pageNo=this.body.pageNo
        this.pagination.limit=this.body.limit
        this.body.userType = ROLES.tagger
        delete this.body['seriesName']
        this.clicked = !this.clicked
        this._fetchUserListing()
      }
    })
  }
  getTaggerIds() {
    this.statusObservable = this.sharedService.taggerIds.subscribe((res) => {
      if (res) {
        if (res?.length != 0)
          this.body.taggerIds = res
        // console.log(res)
        else {
          this.body.taggerIds = undefined
        }
        this._fetchUserListing()
      }
    })
  }
  changeLimit() {
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this._fetchUserListing()
  }
  getFullName() {
    this.nameSearchObservable = this.sharedService.nameSearch.pipe(takeUntil(this.isAlive)).subscribe((res) => {
      console.log(res, "RESPONSE")
      if (res != null) {
        if (res === '') {
          this.body.fullName = undefined
        }
        else
          this.body.fullName = res
        this._fetchUserListing()
      }
    })
  }

  getDate() {
    this.monthObservable = this.sharedService.lastMonth.subscribe((res) => {
      if (res) {
        const date = new Date();
        this.body.date = {
          startDate: date,
          endDate: res
        }
        this._fetchUserListing()
      }
    })
  }
  onPageChange(event: any) {
    this.pagination.pageNo = event;
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
      userType: ROLES.tagger,
    }
    this._fetchUserListing()
  }

  selectedIndex: any
  setChild(index: any, id: any = 0) {
    console.log(index)
    if (this.selectedIndex != null && this.selectedIndex != index) {
      this.taggers[this.selectedIndex].clicked = !this.taggers[this.selectedIndex].clicked
    }
    this.selectedIndex = index == this.selectedIndex ? null : index;

    // console.log('onChildSelect', index);
    this.isChildActive = index;
    this.taggers[index].clicked = !this.taggers[index].clicked
    if (this.taggers[index].clicked) {
      this.manageAnnotatorService.setAnnotatorId(id)
    }
    else if (this.clicked && this.selectedIndex == null) {
      this.manageAnnotatorService.setAnnotatorId(0)
    }
    console.log(this.taggers)
    // this.activeChildId = scene.id
  }

  constructor(private apiService: ApiService, private sharedService: SharedService,
    private manageAnnotatorService: ManageAnnotatorsService) { }

  _fetchUserListing() {
    this.selectedItems = []
    // this.loader = true
    this.selectedIndex = null
    // this.totalCount=
    this.apiService.sendRequest(requests.getUserListing, 'post', this.body).subscribe((res: any) => {
      this.loader = false
      this.totalCount = res?.data?.count;
      this.taggers = res?.data?.rows;
      console.log(this.taggers, "Taggers")
      // console.log(this.taggers)
      for (let i = 0; i < this.taggers?.length; i++) {

        this.taggers[i].status = { class: this.Statuses[this.taggers[i]?.userStatusId - 1]?.class, title: this.Statuses[this.taggers[i]?.userStatusId - 1]?.title }
        this.taggers[i].clicked = false
        this.taggers[i].TaggerTagsCount.scenesTodo=this.taggers[i]?.TaggerTagsCount?.scenesTodo?.toLocaleString("en-US")??0
        this.taggers[i].TaggerTagsCount.averageVzotScore=this.taggers[i]?.TaggerTagsCount?.averageVzotScore?.toLocaleString("en-US")??0
        this.taggers[i].TaggerTagsCount.scenesInprogress=this.taggers[i]?.TaggerTagsCount?.scenesInprogress?.toLocaleString("en-US")??0
        this.taggers[i].TaggerTagsCount.scenesReturned=this.taggers[i]?.TaggerTagsCount?.scenesReturned?.toLocaleString("en-US")??0
        this.taggers[i].TaggerTagsCount.tagCount=this.taggers[i]?.TaggerTagsCount?.tagCount?.toLocaleString("en-US")??0
        this.taggers[i].TaggerTagsCount.taggedScenesCount=this.taggers[i]?.TaggerTagsCount?.taggedScenesCount?.toLocaleString("en-US")??0
        if (this.taggers[i].id == this.manageAnnotatorService.getAnnotatorId()) {
          this.setChild(i, this.taggers[i].id)
          this.scrollToElement()
        }
        if (this.taggers[i].status)
          this.selectedItems.push(this.taggers[i].status)
      }
      // console.log(this.taggers)
    });
    setTimeout(() => {
      
    }, 3000);
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
        userType: ROLES.tagger,
      }

      this._fetchUserListing()
    }
  }
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  updateStatus($event:any, userId: number) {
    // console.log(this.selectedItems, "Selected Items")
    // console.log(index)
    // console.log(this.selectedItems[index])
    this.apiService.sendRequest(requests.updateTaggerStatus, 'post', {

      statusId: $event.id,
      userId: userId
    }).subscribe((res) => {
      // // console.log(res)
    })
  }
  sort(order: number, heading: number) {
   this.tableHeadings = [{ name: "Annotator Name", class: "",order:"" }, { name: "Total Product Records", class: "",order:"" }, { name: "Avg VZoT", class: "", order:""}, { name: "To Do", class: "todo",order:"" }, { name: "In Progress", class: "inprogress", order:"" }, { name: "Returned", class: "returned",order:"" }, { name: "Approved", class: "approved",order:"" }, { name: "Employment Status", class: "",order:"" }]
    let sortingOrder
    if (order == 1) {
      sortingOrder = "ASC"
      this.tableHeadings[heading].order="ASC"
    }
    else {
      sortingOrder = "DESC"
      this.tableHeadings[heading].order="DESC"
    }

    if (heading == 0 || heading == 7) {
      this.body.userOrder = [[this.backendHeadings[heading], sortingOrder]]
      this.body.taggerOrder = undefined
    }
    else {
      this.body.taggerOrder = [[this.backendHeadings[heading], sortingOrder]]
      this.body.userOrder = undefined

    }
    this._fetchUserListing()
  }
  closeModal(e) {
    // this.selectedIndex = null
    console.log(e)
    this.setChild(this.selectedIndex)
    if (e != 'Cancel')
      this._fetchUserListing()

    //this.clicked = !this.clicked
  }
  ngOnDestroy() {
    this.sharedService.nameSearch.next(null)
    this.sharedService.taggerIds.next(null)
    this.sharedService.userAdded.next(null)
    this.monthObservable.unsubscribe()
    this.nameSearchObservable.unsubscribe()
    this.$annotatorFilter.unsubscribe()
    this.refreshObs.unsubscribe()
  }
  scrollToElement() {
    setTimeout(() => {
      // console.log("SERIES ID", this.annotator.id)
      const element = document.getElementById(this.manageAnnotatorService.getAnnotatorId()+"");
      console.log(element)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}
