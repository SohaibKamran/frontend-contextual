import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-advertisers',
  templateUrl: './select-advertisers.component.html',
  styleUrls: ['./select-advertisers.component.scss']
})
export class SelectAdvertisersComponent implements OnInit {

  selectAdvertisersForm: FormGroup;

  constructor(public modalService: NgbModal,
    private formbuilder: FormBuilder){
  }

  ngOnInit(): void {
   this.initForm()
  }

  private initForm(){
    this.selectAdvertisersForm = this.formbuilder.group({
      grocery: [false,[Validators.required]],
      departmentStores: [false,[Validators.required]],
      household: [false,[Validators.required]],
      speciality: [false,[Validators.required]],
      amazonFood: [false,[Validators.required]],
      bloomingDales: [false,[Validators.required]],
      bestBuy: [false,[Validators.required]],
      sportingGoods: [false,[Validators.required]],
      cvsDrugs: [false,[Validators.required]],
      macy: [false,[Validators.required]],
      crateBarrel: [false,[Validators.required]],
      petsmart: [false,[Validators.required]],
      sephoraCosmetics: [false,[Validators.required]],
      nordstrom: [false,[Validators.required]],
      officeMax: [false,[Validators.required]],
      sunglassHut: [false,[Validators.required]],
      zappos: [false,[Validators.required]],
      wayfair: [false,[Validators.required]],
      sweetwaterMusic: [false,[Validators.required]],
      worldofWatches: [false,[Validators.required]],
    })
  }

}
