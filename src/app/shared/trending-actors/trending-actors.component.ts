import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Data, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { DatabaseService } from 'src/app/pages/database/database.service';
import { MyShoppingService } from 'src/app/pages/demo-user/my-shopping/my-shopping.service';
@Component({
  standalone: true,
  selector: 'app-trending-actors',
  templateUrl: './trending-actors.component.html',
  imports: [CommonModule, CoreModule],
  styleUrls: ['./trending-actors.component.scss']
})
export class TrendingActorsComponent implements OnInit {
  trendingActors: any = []
  body: any
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  totalCount = 0
  count = 0
  @Input() screen: string
  constructor(private apiService: ApiService, private router: Router, private databaseService: DatabaseService, private shoppingService:MyShoppingService) {

  }
  ngOnInit() {
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this.fetchData();

  }

  setActor(actor) {
    if (this.screen != 'My Shopping') {
      const actorToSend = {
        text: actor.name,
        id: actor.id
      }
      this.databaseService.databaseRecords.next({
        pageNo: 1,
        limit: 10,
        actorIds: [actor.id],
        actors: [actorToSend]
      })
      this.routeToDatabase()
    }
    else{
      sessionStorage.setItem('actor', JSON.stringify(actor))
      this.shoppingService.selectedTab.next(2)
    }
  }

  routeToDatabase(flag?:boolean){

    if(flag){
      this.shoppingService.selectedTab.next(2)
    }
    else
      this.router.navigate(['/database/filtered'])
  }

  fetchData() {
    if (this.totalCount != this.count || this.count == 0) {
      this.apiService.sendRequest(requests.getTrendingActors, 'post', this.body).subscribe((res: any) => {
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          this.trendingActors[this.totalCount] = res?.data?.rows[i]
          if(this.trendingActors[this.totalCount].imageUrl===""){
            this.trendingActors[this.totalCount].imageUrl=null
          }
          this.totalCount++
        }
      })
    }

  }
  onScrollEnd(e) {
    // console.log(e.endReached);
    console.log(e.endReached);
    if (e.endReached) {
      this.pagination.pageNo++
      this.body = {
        ...this.body, pageNo: this.pagination.pageNo
      }
      this.fetchData()
    }
  }
  ngOnDestroy(): void {

  }
  // actors = [
  //   {
  //     src: 'assets/images/actors/actor4.jpg',
  //     status: 'text-danger',
  //     time: 'now',
  //     name:'Jennifer Aniston'
  //   },
  //   {
  //     src: 'assets/images/actors/actor2.jpg',
  //     status: 'text-success',
  //     time: '2 min ago',
  //     name:'George Clooney'
  //   },
  //   {
  //     src: 'assets/images/actors/actor3.jpg',
  //     status: 'text-primary',
  //     time: '1 day ago',
  //     name:'Julianna margulies'
  //   },
  //   {
  //     src: 'assets/images/actors/actor2.jpg',
  //     status: 'text-warning',
  //     time: '3 week ago',
  //     name:'Prison Break'

  //   }
  // ];

}



