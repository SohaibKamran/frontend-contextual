import { Component, OnInit, ElementRef, } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FilterService } from '../services/filter.service.';

@Component({
  selector: 'app-api-control',
  templateUrl: './api-control.component.html',
  styleUrls: ['./api-control.component.scss']
})
export class ApiControlComponent implements OnInit {

  ApiControl = []
  toggleBody = {

    environmentToToggle: "",
    operation: ""
  }
  closeResult = '';
  content;
  $videoFilter: Subject<any> = new Subject;
  totalCost: any;
  priceArray = ["150","140","120","190","110","122"]
  filterName = "Last Month"
  filters:string[]
  interval:any
  costs=[]
  dates:any

 
  constructor(private apiService: ApiService, private modalService: NgbModal,private filterService:FilterService) {

  }

  ngOnInit(): void {

    this.setInitialBody()
    this.fetchStatus();
    

    this.filters=this.filterService.getFilterNames();
  }

  setInitialBody(){
    this.interval={
      Granularity: "MONTHLY",
      StartDate: this.filterService.setMinDate('monthly').split(' ')[0],
      EndDate: new Date().toISOString().split('T')[0],
    }
    this.getCumulativeCloudCosts();
  }
  filterData(filter:any) {
  
    // console.log(filter)
    this.filterName=filter
    filter = filter.toLowerCase() 
    const minDate = this.filterService.setMinDate(filter).split(' ')[0]

    console.log(minDate)
    const maxDate = new Date().toISOString().split('T')[0]
    let granularity=""
    if(filter.includes('month')){
      granularity="DAILY"
    }
    if(filter.includes('week')){
      granularity="DAILY"
    }
    if(filter.includes('year')){
      granularity="MONTHLY"
    }
    this.interval={
      Granularity:granularity,
      StartDate:minDate,
      EndDate:maxDate
    }
    this.getCumulativeCloudCosts()
  }


  fetchStatus() {
    this.apiService.sendRequest(requests.getCloudStatus, 'post').subscribe((res: any) => {
      this.ApiControl = res.data
      
      // console.log(this.ApiControl)
    })
  }
  changeStatus(content: any, api: any) {
    this.toggleBody.environmentToToggle = api.key.toUpperCase()

    if (api.value == true) {
      this.toggleBody.operation = "STOP"
    }
    else {
      this.toggleBody.operation = "START"
    }
    this.open(content)
    // console.log(this.toggleBody)
  }
  open(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result=='yes'){
          this.toggleApiStatus()
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  toggleApiStatus() {
    this.apiService.sendRequest(requests.toggleEnvironment, 'post', this.toggleBody).subscribe((res)=>{
      // console.log(res)
      this.fetchStatus()
    })
  }  
  getCumulativeCloudCosts(){
    this.costs=[]
    this.apiService.sendRequest(requests.getCumulativeCloudCosts, 'post',this.interval)
    .subscribe((res:any) => {
      // console.log(res);
      const result = JSON.parse(JSON.stringify(res))
      const dev = parseFloat(res?.data?.devEnvCost.replace('$','')).toFixed(2)
      const prod = parseFloat(res?.data?.prodEnvCost.replace('$','')).toFixed(2)
      console.log(dev, 'dev')
      this.totalCost = parseFloat(result?.data?.cumulativeCost.replace('$','')).toFixed(2)
      this.costs.push(dev,0,0,prod)
      console.log(this.costs)
    })
  }

}
