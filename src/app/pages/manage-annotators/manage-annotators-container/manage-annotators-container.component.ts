import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AddEditAnnotatorComponent } from '../add-edit-annotator/add-edit-annotator.component';
import { SharedService } from 'src/app/core/services/shared.service';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { AnnotatorsFilterComponent } from 'src/app/shared/annotators-filter/annotators-filter.component';
import { AddUserModalComponent } from 'src/app/shared/add-user-modal/add-user-modal.component';
@Component({
  selector: 'app-manage-annotators-container',
  templateUrl: './manage-annotators-container.component.html',
  styleUrls: ['./manage-annotators-container.component.scss']
})
export class ManageAnnotatorsContainerComponent {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  seriesTitle="Trending Series"
  seriesCardHeight="dashboard-series"
  constructor(public modalService: NgbModal,private sharedService:SharedService,private apiService:ApiService) {
    this.breadCrumbItems = [
      { label: 'Admin' },
      { label: 'Annotators', active: true }
    ];
  }
  cities = [];
  selectedItems = [];
  dropdownSettings: any = {};
  $annotatorFilter: Subject<any> = new Subject;
  nameSearch:string
  tagger=[]
  selectedTaggers=[]
  taggerPagination: { pageNo: number, limit: number, offset?: number, taggerName?: string } = { pageNo: 1, limit: 10 }
  fetchedTaggerCount=0
  totalTaggerCount = 0
  taggerLoader:boolean=false
  ngOnInit() {
    
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
    };
   this.getTagger()
   this.fetchCountries()
   this.sharedService.taggerIds.next(null)
  }
  open(content?: any) {
    const modalRef = this.modalService.open(AnnotatorsFilterComponent, {
      windowClass: "modal-md",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.screen='Annotator'
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      // console.log("-==================>", receivedEntry)
      this.$annotatorFilter.next(receivedEntry)
      this.modalService.dismissAll()
    })
  }

  clearSearch(){
    this.taggerPagination={pageNo:1,limit:10,taggerName:undefined}
    this.getTagger('')
  }
  searchTagger($event) {
    this.taggerPagination.pageNo=1
    this.fetchedTaggerCount = 0
    if ($event.term != '')
      this.taggerPagination.taggerName = $event.term
    else
      this.taggerPagination.taggerName = undefined
    this.getTagger($event.term)
  }
  openAddEditModal(){

    const activeModel=this.modalService.open(AddUserModalComponent,{
      windowClass: "modal-lg",
      backdrop: "static",
      keyboard: false,
      centered: true,

    })
    activeModel.componentInstance.screen=false
    
  }

  monthFilter() {
    // Get a date object for the current time
    const d = new Date();

    // Set it to one month ago
    d.setMonth(d.getMonth() - 1);

    // Zero the time component
    d.setHours(0, 0, 0, 0);

    this.sharedService.lastMonth.next(d)

    // Get the time value in milliseconds and convert to seconds
    // // console.log(d / 1000 | 0);
  }

  searchByName(){

    // console.log("fucntion called")
    // console.log(this.nameSearch)

    this.sharedService.nameSearch.next(this.nameSearch)
  }

  getTagger(searchTagger?:string) {
    const tag = []
    this.taggerLoader=true
    if (this.totalTaggerCount != this.fetchedTaggerCount || this.totalTaggerCount == 0) {
      this.apiService.sendRequest(requests.getTagger, 'post', this.taggerPagination).subscribe((res: any) => {
        if (searchTagger || searchTagger === '')
          this.tagger = []
        this.taggerLoader = false
        this.totalTaggerCount = res?.data?.count
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          const obj = {
            id: res?.data?.rows[i]?.id, fullName: res?.data?.rows[i]?.fullName
          }
          this.tagger = [...this.tagger, obj]
          this.fetchedTaggerCount++
          console.log(tag[i])
        }
        console.log(this.tagger)
      })
    }
    else
      this.taggerLoader=false
  }

  onItemSelect(item: any) {
    // console.log('onItemSelect', item);
    console.log(item)
    console.log(this.selectedTaggers, "Selected Taggers")
    this.sharedService.taggerIds.next(item.map(item=>item.id))
  }
  fetchCountries(){

    this.apiService.sendRequest(requests.getCountries,'post',{pageNo:1,limit:249}).subscribe((res:any)=>{
      // console.log(res)
      this.sharedService.countries.next(res?.data?.countries?.rows)
    })
  }
  onTaggerScrollEnd($event) {
    this.taggerPagination.pageNo++
    this.getTagger()
  }
}
