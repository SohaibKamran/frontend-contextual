import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-tagger-register-success',
  templateUrl: './tagger-register-success.component.html',
  styleUrls: ['./tagger-register-success.component.scss']
})
export class TaggerRegisterSuccessComponent implements OnInit  {
  
  nothing = ""
  role:any=""
  constructor(private route:ActivatedRoute, private router:Router){
    this.nothing = "nothing"
  }
  
  ngOnInit(): void {
    // console.log(this.nothing);
    this.route.queryParams.subscribe(params => {
      // You can access the query parameters here
      this.role = params['role'];
        // ...
      console.log(params)
    });
  }

  navigateTo(){
    if(this.role=='user')
      this.router.navigate(['/auth/login'])
    else
      this.router.navigate(['/auth/tagger-login'])
  }
}