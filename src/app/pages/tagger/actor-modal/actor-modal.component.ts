import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TaggerService } from '../tagger.service';

@Component({
  selector: 'app-actor-modal',
  templateUrl: './actor-modal.component.html',
  styleUrls: ['./actor-modal.component.scss']
})
export class ActorModalComponent implements OnInit {

  constructor(private taggerService: TaggerService,private dialogRef: MatDialogRef<ActorModalComponent>) { }
  allActors:any[]=[]
  actorName='';
  actorImageSrc='';
  actorObj:any;
  actorSelect(name:any,imgSrc:any,id:any)
  {
    // let index=this.currentSelection
    this.actorName=name;
    this.actorImageSrc=imgSrc;
    this.actorObj={
      name: this.actorName,
      imageUrl: this.actorImageSrc,
      id: id
    }
    // this.taggerService.onFirstComponentButtonClick();
    // this.proxyProducts[index].Actor=actorObj
    // this.proxyProducts[index].actorId=id
    // console.log(this.actorObj);
    this.dialogRef.close(this.actorObj)
  }
  ngOnInit(): void {
    this.taggerService.getActors().subscribe(data=>{
      this.allActors=data['data']
    })
  }

}
