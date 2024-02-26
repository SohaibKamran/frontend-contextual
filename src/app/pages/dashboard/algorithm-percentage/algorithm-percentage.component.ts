import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-algorithm-percentage',
  templateUrl: './algorithm-percentage.component.html',
  styleUrls: ['./algorithm-percentage.component.scss']
})
export class AlgorithmPercentageComponent implements OnInit {

  total: number = 100
  algoPercentage = {
    data: {
      gcp: "",
      color: "",
      tag: ""
    }
  }
  errorMsg: boolean = false
  loader:boolean=false
  constructor(private apiService: ApiService, private toastr:ToastrService) { }
  ngOnInit() {
    this.getAlgoPercentage()
  }

  getAlgoPercentage() {
    this.loader=true
    this.apiService.sendRequest(requests.getAlgoScores, 'post').subscribe((res: any) => {
      this.loader=false
      console.log(res)
      this.algoPercentage = { data: { color: res?.data?.value.color, gcp: res?.data?.value?.gcp, tag: res?.data?.value?.tag } }
      console.log(this.algoPercentage)
    })
  }
  updateTotal() {
    const sum = parseInt(this.algoPercentage.data.color + this.algoPercentage.data.tag + this.algoPercentage.data.gcp);
    if (sum != 100) {
      this.errorMsg = true
    }
    else {
      this.loader=true
      this.errorMsg = false
      this.apiService.sendRequest(requests.updateAlgoScores, 'post', this.algoPercentage.data).subscribe((res) => {
        this.loader=false
        this.toastr.success('Updated Successfully')
      })
    }
  }
}
