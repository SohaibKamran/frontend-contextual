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
  @Input() alreadySelectedArray:any=[];
  getAllAdvertisers() {
    this.apiService
      .sendRequest(requests.getAllAdvertiser, 'post', { pageNo: 1, limit: 50 })
      .subscribe((res: any) => {
        this.advertisersList = res?.data
        if(this.alreadySelectedArray.length!=0)
        {
          this.selectedAdvertisers= this.alreadySelectedArray
          if(this.selectedAdvertisers.length==this.advertisersList.length)
          {
            this.selectAll =false;
            this.toggleSelectAll();
          }
          else
          {
            this.selectAll = true;
            this.toggleSelectAll()
          }
        } 
        else
        {
          for (let x in this.advertisersList) {
              this.selectedAdvertisers.push(this.advertisersList[x])
          }
          this.selectAll = false;
          this.toggleSelectAll();
        }
      });
  }

  closeModal() {
    this.modal.close('Close click')
  }

  onChange($event, advertiser) {
    console.log('hi');
    
    if ($event.target.checked) {
      this.selectedAdvertisers.push(advertiser);
    } else {
      for(let x=0;x < this.selectedAdvertisers.length;x++)
      {
        if(this.selectedAdvertisers[x].id == advertiser.id && this.selectedAdvertisers[x].name == advertiser.name)
        {
          this.selectedAdvertisers.splice(x,1)
          break;
        }
      }
    }
    // console.log("🚀 ~ file: filter-advertisers.component.ts:46 ~ FilterAdvertisersComponent ~ onChange ~ this.selectedAdvertisers:", this.selectedAdvertisers)
  }

  getUpdatedAdvertisersProducts() {
    const body = {
      ...(this.selectedAdvertisers && this.selectedAdvertisers.length > 0 ? { retailers: this.selectedAdvertisers } : null),
    }
    this.passEntry.emit(body);
    this.modal.close('Close click');
  }

  private initForm() {
    this.filterAdvertisersForm = this.formbuilder.group({
      advertisers: [true, [Validators.required]],
    })
  }

}
