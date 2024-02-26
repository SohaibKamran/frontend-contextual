import { Component, OnInit } from '@angular/core';
import { TaggerService } from 'src/app/pages/tagger/tagger.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cdk-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

  constructor(private taggerService: TaggerService) { }
  allActors:any[]=[]
  actorName='';
  actorImageSrc='';
  actorSelect(name:any,imgSrc:any,id:any)
  {
    // let index=this.currentSelection
    this.actorName=name;
    this.actorImageSrc=imgSrc;
    // eslint-disable-next-line prefer-const
    let actorObj={
      name: this.actorName,
      imageUrl: this.actorImageSrc,
      id: id
    }
    // this.taggerService.onFirstComponentButtonClick();
    // this.proxyProducts[index].Actor=actorObj
    // this.proxyProducts[index].actorId=id
    // console.log(actorObj);
    
  }
  ngOnInit(): void {
    // this.taggerService.getActors().subscribe(data=>{
    //   this.allActors=data['data']
    // })
    // console.log();
    
  }

}
