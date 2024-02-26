import { Component } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
@Component({
  selector: 'app-top-super-proxy-streamer',
  templateUrl: './top-super-proxy-streamer.component.html',
  styleUrls: ['./top-super-proxy-streamer.component.scss']
})
export class TopSuperProxyStreamerComponent {
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  activeUsers: any;
  superProxies: any;
  totalImpressions: number

  constructor(public apiService: ApiService,private router:Router) { }

  ngOnInit(): void {

    this.fetchTopSuperProxies();
  }

  fetchTopSuperProxies() {
    this.apiService.sendRequest(requests.getTopSuperProxyProduct, 'post', this.pagination)
    .subscribe((res: any) => {
      // console.log(res);
      this.superProxies = res?.data?.rows;
    })
  }
  routeToDatabase(){

    this.router.navigate(['/database'])
  }

}
