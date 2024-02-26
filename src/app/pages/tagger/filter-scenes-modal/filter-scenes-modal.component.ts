import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter-scenes-modal',
  templateUrl: './filter-scenes-modal.component.html',
  styleUrls: ['./filter-scenes-modal.component.scss']
})
export class FilterScenesModalComponent implements OnInit {
  
  startingTime: any;
  endingTime: any;
  showId: any;
  filterForm: FormGroup;
  operator: any;
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 1000, pageNo: 1}
  body:any={}
  @Input() formBody:any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() outputForm:EventEmitter<any> = new EventEmitter();
  $sceneFilter: Subject<any> = new Subject;
  constructor(
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
  ){

  }
  
  ngOnInit(): void {
    this.initForm();
  }

  private initForm(){
    this.filterForm = this.formBuilder.group({
      sceneNo: [this.formBody.sceneNo, [Validators.required]],
      rangeStart: [this.formBody.rangeStart, [Validators.required]],
      rangeEnd: [this.formBody.rangeEnd, [Validators.required]],
      proxyNo: [this.formBody.proxyNo, [Validators.required]],
      proxyInput: [this.formBody.proxyInput, [Validators.required]],
      products: [this.formBody.products,[Validators.required]],
      productInput: [this.formBody.productInput, [Validators.required]],

    })
  }
  resetForm()
  {
    this.filterForm.reset();
    this.submitFilter(true);
  }
  submitFilter(option?:boolean){
    
    if(!option) this.modalService.dismissAll()
    this.showId = parseInt(sessionStorage.getItem('showId'))
    if (parseInt(this.filterForm.value.proxyNo) === 1) {
      // console.log("value",this.filterForm.value.proxyNo)
      this.operator = '<';
    } else {
      if (parseInt(this.filterForm.value.proxyNo) === 2) {
        this.operator ='>';
      }
    }
    
    // console.log("this.operato:",  this.operator)

    const sceneId=this.filterForm.value.sceneNo
    if(sceneId!="0"&&sceneId!=null&&sceneId!=undefined){

      this.body.relativeSceneNo=parseInt(sceneId)
    }

    if(this.showId!="0"&&this.showId!=null&&this.showId!=undefined){

      this.body.showId=this.showId
    }


    if(this.operator!="0"&&this.operator!=null&&this.operator!=undefined){
      this.body.coordinateCountFilter={
        operator: this.operator,
        value: parseInt(this.filterForm.value.proxyInput)
      }
    }

    
    this.startingTime =  Math.floor((parseInt(this.filterForm.value.rangeStart))*1000);
    this.endingTime =  Math.floor((parseInt(this.filterForm.value.rangeEnd))*1000);
    // console.log(this.startingTime)

    if(this.filterForm.value.rangeStart!=null && this.filterForm.value.rangeStart!=undefined){

      this.body.timeRange= {
        startTime: this.startingTime,
        endTime: this.endingTime,
      }
    }
    if(this.filterForm.value.products!=null)
    {
      this.body.productSearchTerm = this.filterForm.value.products
    }

    this.$sceneFilter.next(this.body);

    this.passEntry.emit(this.body)
    this.outputForm.emit(this.filterForm)
    // this.sharedService.sceneBodyFilters.next(this.body)
    // this.apiService.sendRequest(getAllScenesOfShow, 'post', this.body)
    // .subscribe((res: any) => {
    //   // console.log(res);
    // })

  }
}
