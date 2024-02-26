import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-filter-advertisers',
  templateUrl: './filter-advertisers.component.html',
  styleUrls: ['./filter-advertisers.component.scss']
})
export class FilterAdvertisersComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() closeCheck: EventEmitter<any> = new EventEmitter();
  @Input() alreadySelectedArray:any=[];

  filterAdvertisersForm: FormGroup;
  advertisersList: any = []
  selectedAdvertisers: any = []
  constructor(public modalService: NgbModal,
    public modal: NgbActiveModal,
    private apiService: ApiService,
    private formbuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm()
    this.getAllAdvertisers()
  }

  selectAll = true;
  toggleSelectAll()
  {
    if(this.selectAll) this.selectAll=false;
    else this.selectAll=true;
  }
  isChecked(advertiser: any): boolean {   
    for(let x in this.selectedAdvertisers)
    {
      if(this.selectedAdvertisers[x].id == advertiser.id && this.selectedAdvertisers[x].name == advertiser.name)
      {
        return true;
      }        
    }
    return false;
  }
  show = false;
  getAllAdvertisers() {
    this.apiService
      .sendRequest(requests.getAllAdvertiser, 'post', { pageNo: 1, limit: 50 })
      .subscribe((res: any) => {
        this.advertisersList = res?.data
       this.advertisersList.map(adlist=>{
          adlist.Retailers.map(retailers=>{
            retailers.selected = false;
            if(this.alreadySelectedArray.length>0)
            {
              const matchingRetailer = this.alreadySelectedArray.find(selectedRetailer => selectedRetailer.id === retailers.id);

              if (matchingRetailer) {
                retailers.selected = true;
              }
            }
          })
        })
        this.show = true;
      });
  }

  closeModal() {
    let mergeRetailers = [];
    this.advertisersList?.forEach(category => {
      category?.Retailers?.forEach(retailer => {
          mergeRetailers?.push(retailer);
      });        
    });
    let objBody = {
      retailers: mergeRetailers
    }
    this.passEntry.emit(objBody);
    this.closeCheck.emit(true);
    this.modal.close('Close click');
    this.modal.close('Close click')
  }

  getUpdatedAdvertisersProducts() {

    let mergeRetailers = [];
    this.advertisersList?.forEach(category => {
      category?.Retailers?.forEach(retailer => {
        if(retailer.selected==true)
        {
          mergeRetailers?.push(retailer);
        }
      });
    });
    let objBody = {
      retailers: mergeRetailers
    }
    this.passEntry.emit(objBody);
    this.modal.close('Close click');
  }

  private initForm() {
    this.filterAdvertisersForm = this.formbuilder.group({
      advertisers: [true, [Validators.required]],
    })
  }

}
