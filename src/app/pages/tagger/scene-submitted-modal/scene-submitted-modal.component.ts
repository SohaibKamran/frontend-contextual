import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scene-submitted-modal',
  templateUrl: './scene-submitted-modal.component.html',
  styleUrls: ['./scene-submitted-modal.component.scss']
})
export class SceneSubmittedModalComponent implements OnInit {
  
  constructor(
    public modalService: NgbModal
  ){

  }
  ngOnInit(): void {
    // console.log("scene");
  }

}
