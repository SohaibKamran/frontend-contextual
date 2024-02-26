import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
@Component({
  selector: 'app-key-management',
  templateUrl: './key-management.component.html',
  styleUrls: ['./key-management.component.scss']
})
export class KeyManagementComponent implements OnInit {
  keys:any=[]
  loader = false;
  ngOnInit(): void {
    this.getKeys();
    console.log('ssdsdsd');
  }
  constructor(private apiService: ApiService){

  }
  getKeys(){
    this.loader = true;
    this.apiService.sendRequest(requests.getStreamerApiKeys, 'POST').subscribe((res: any) => {
      this.keys = res?.data
      this.loader = false;
    })
  }
  createApiKey(){
    this.loader = true;
    this.apiService.sendRequest(requests.generateStreamerApiKey, 'POST').subscribe((res: any) => {
      this.getKeys()
    })
  }
  deleteApiKey(id){
    this.loader = true;
    const body = {
      apiKeyId: id
    }
    this.apiService.sendRequest(requests.deleteStreamerApiKey, 'POST',body).subscribe((res: any) => {
      this.keys = this.keys.filter(key=>key.id != id)
      this.loader = false;
    })
  }

  deleteKey(id){
    console.log(id);
  }
}
