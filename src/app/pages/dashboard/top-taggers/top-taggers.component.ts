import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
import { ManageAnnotatorsService } from '../../manage-annotators/manage-annotators.service';
@Component({
  selector: 'app-top-taggers',
  templateUrl: './top-taggers.component.html',
  styleUrls: ['./top-taggers.component.scss']
})
export class TopTaggersComponent implements OnInit {

  taggerLength=0
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  topTagger: any=[];
  body: any
  constructor(private apiService: ApiService, private router: Router, private manageAnnotatorService: ManageAnnotatorsService) { }
  ngOnInit(): void {
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this.fetchData();
  }

  topTaggers = [
    {
      src: 'assets/images/user/avatar-4.jpg',
      status: 'text-danger',
      time: 'now',
      name: 'Jennifer Aniston'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      status: 'text-success',
      time: '2 min ago',
      name: 'George Clooney'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      status: 'text-primary',
      time: '1 day ago',
      name: 'Julianna margulies'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      status: 'text-warning',
      time: '3 week ago',
      name: 'Prison Break'

    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      status: 'text-warning',
      time: '3 week ago',
      name: 'Prison Break'

    }
  ];

  fetchData() {
    this.apiService.sendRequest(requests.getTopTaggers, 'post', this.body)
      .subscribe((res: any) => {
        // console.log(res);
        if (res?.data?.rows?.length != 0) {
          for (let i = 0; i < res?.data?.rows.length; i++) {
            this.topTagger[this.taggerLength] = res?.data.rows[i];
            this.taggerLength++
          }
        }
      })
  }
  routeToAnnotators(tagger: any = null) {
    if (tagger) {
      this.apiService.sendRequest(requests.getTopTaggers, 'post', this.body)
        .subscribe((res: any) => {
          // console.log(res);
          console.log(res)
          sessionStorage.setItem('tagger', JSON.stringify({
            pageNo: res?.data?.pageNoOfUser,
            count: res?.data?.count
          }))
          this.router.navigate(['/manage-annotators'])
        })
    }
  }
  fetchPageNumber(tagger: any) {
    console.log(tagger.id)
    this.body = {
      ...this.body,
      clickedOnTaggerId: tagger.id,
      limitOfUserListing: this.pagination.limit
    }
    this.manageAnnotatorService.setAnnotatorId(tagger.id)
    this.routeToAnnotators(tagger)
  }
  onScrollEnd(e) {
    console.log(e.endReached);
    if (e.endReached) {
      this.pagination.pageNo++
      this.body = {
        ...this.body, pageNo: this.pagination.pageNo
      }
      this.fetchData()
    }

  }

}
