import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone:true,
  imports:[CommonModule],
  selector: 'app-ad-alert',
  templateUrl: './ad-alert.component.html',
  styleUrls: ['./ad-alert.component.scss']
})
export class AdAlertComponent {
  @Input() link:string=""
  open:boolean=true

  constructor(){}
  ngOnInit(){
    
  }
  close(){
    this.open=false
  }
}
