import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-select-annotator',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgSelectModule, NgbModule],
  templateUrl: './select-annotator.component.html',
  styleUrls: ['./select-annotator.component.scss']
})
export class SelectAnnotatorComponent {
  @Input() redirectUrl
  taggers = []
  taggerId: number = null
  totalTaggerCount = 0;
  fetchedTaggerCount = 0
  currentUser: any = null
  taggerPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 10 }
  constructor(private activeModal: NgbActiveModal, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userId'))
    this.taggers.push({ id: this.currentUser, fullName: 'Myself' })
    this.getTaggers()
  }

  getTaggers() {
    if (this.totalTaggerCount != this.fetchedTaggerCount || this.totalTaggerCount == 0) {
      this.apiService.sendRequest(requests.getTagger, 'post', this.taggerPagination).subscribe(async (res: any) => {
        this.totalTaggerCount = await res?.data?.count
        if (res?.data?.rows != 0)
          this.taggers = this.taggers?.concat(res?.data?.rows)
      })
    }
  }

  onTaggerScrollEnd(e) {
    this.taggerPagination.pageNo++
    this.getTaggers()
  }

  onChange(tagger) {
    this.taggerId = tagger?.id
  }

  selectTagger() {
    localStorage.setItem('simulatedtaggerid', this.taggerId.toString())
    const showId = JSON.parse(sessionStorage.getItem('showId'))
    if (showId)
      sessionStorage.removeItem('showId')
    this.router.navigate([`${this.redirectUrl}`])
    this.activeModal.close('close')
  }

  CloseModal() {
    this.activeModal.close('close')
  }

}
