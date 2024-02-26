import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms'
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
@Component({
  selector: 'app-chat-gpt-modal',
  templateUrl: './chat-gpt-modal.component.html',
  styleUrls: ['./chat-gpt-modal.component.scss']
})
export class ChatGptModalComponent implements OnInit {

  input_query: ""
  filters = []
  body = []
  ids = []
  selectedTags = []
  idsArray = [];
  loader = false
  tagger: any
  coordinateId: any
  public observable;
  sceneImage: any;
  error: boolean = false
  constructor(
    public modalService: NgbModal,
    public modal: NgbActiveModal,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {

  }

  ngOnDestroy() {
    this.observable.unsubscribe();
  }
  ngOnInit(): void {
    this.isAddAttribute()
    this.getUserInfo();
    this.observable = this.sharedService.sceneThumbnail.subscribe((data: any) => {
      this.sceneImage = data
    })

  }

  isAddCall: boolean = false;
  fromTagSummary: boolean = false;

  isAddAttribute() {
    this.sharedService.isAddAttributeCall.subscribe((res) => {
      if (res) {
        this.isAddCall = res?.isAddAttribute;
        this.fromTagSummary = res?.fromTagSummary
        this.coordinateId = res?.id;
        res?.tagIds?.forEach(id => {
          this.idsArray.push(id)
        });
      }
    })
  }

  async addAttributesMethod() {
    for (let i = 0; i < this.selectedTags.length; i++) {
      const body = [{
        name: this.selectedTags[i].name,
        isHelper: "0",
        parentTagId: null,
        level: 3
      }]
      const res = await this.apiService.sendRequest(requests.addTag, 'post', body).toPromise()
      this.idsArray.push(res['data']?.[0]?.id);
    }
    const data = {
      id: this.coordinateId,
      tagIds: this.idsArray
    }
    this.apiService.sendRequest(requests.updateTagProductInScene, 'post', data).subscribe(res => {
      if (this.fromTagSummary)
        this.sharedService.proxyCordinateId.next(this.coordinateId)
      else
        this.sharedService.isTagAdded.next(true)
      this.modal.close('close')
    })
  }

  getUserInfo() {
    this.apiService.sendRequest(requests.getUserProfile, 'post').subscribe((res: any) => {
      this.tagger = res?.data;
    })
  }

  sendFilters() {
    //These selectedTags will appear on the search bar on tagger screen as tags
    this.sharedService.selectedTags.next(this.selectedTags)
    let body = []
    body = this.selectedTags
    for (let i = 0; i < this.selectedTags.length; i++) {
      delete body[i].clicked
    }
    this.apiService.sendRequest(requests.addTag, 'post', body).subscribe((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.ids.push({
          id: res.data[i].id,
          name: res.data[i].name
        })
      }
      this.sharedService.tagIds.next(this.ids)
    })
  }

  selectFilter(filter: any, index: number) {
    const elementIndex = this.selectedTags.findIndex((item) => {
      return item === filter
    })

    if (elementIndex == -1) {
      this.filters[index].clicked = true
      this.selectedTags.push(filter)
    }
    else {
      this.selectedTags.splice(elementIndex, 1)
      this.filters[index].clicked = false
    }
  }

  sendIds() {

    this.sharedService.tagIds.next(this.ids)
  }

  search() {
    if (this.input_query == undefined || this.input_query?.trim() == "") {
      this.error = true;
      return;
    }
    this.error = false;
    this.loader = true
    this.apiService.sendRequest(requests.openAiFilters, 'post', { input_query: this.input_query }).subscribe((res: any) => {
      this.filters = [];
      this.loader = false

      for (let i = 0; i < res['filters'].length; i++) {
        this.filters.push({
          name: res['filters'][i],
          clicked: false,
          isHelper: "1",
          parentTagId: 10,
          level: 2
        })
      }
    })
  }

  addToProxySearch() {

    this.sendFilters()
    this.modalService.dismissAll('Save')

  }

  removeTag(tag: string) {
    const elementIndex = this.selectedTags.findIndex((item) => {
      return item.name === tag
    })
    if (elementIndex != -1) {
      this.selectedTags[elementIndex].clicked = false
      this.selectedTags.splice(elementIndex, 1)
    }
  }

}
