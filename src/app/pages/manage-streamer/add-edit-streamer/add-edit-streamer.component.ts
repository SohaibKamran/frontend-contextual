import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { ManageStreamerService } from '../manage-streamer.service';
import { Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-edit-streamer',
  templateUrl: './add-edit-streamer.component.html',
  styleUrls: ['./add-edit-streamer.component.scss']
})
export class AddEditStreamerComponent {
  advertiserDetailsForm: FormGroup
  onboardingColor = '#1890FF';
  activeColor = 'green';
  inactiveColor = 'red';
  advertiserId: any;
  advertiserData: any;
  // public observable;
  id: number;
  minValue = 0;
  maxValue = 0;
  value = 100;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  countries:any
  countryObservable:any
  selectedCountry:any
  Statuses:any
  selectedStatus:any
  vzot:number
  mater:boolean=false
  loader:boolean=false
  formSubmitted:boolean=false
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService:SharedService,
    public streamerService: ManageStreamerService,
    private router:Router,
    private toastrService:ToastrService) {

  }

  // ngOnDestroy() {
  //   this.observable.unsubscribe();
  // }

  ngOnInit(): void {
    this.fetchCountries()
    this.Statuses = this.sharedService.getStatuses()

    if (this.streamerService.advertiserId !== null) {
      // console.log(this.streamerService.advertiserId);
      // data = id
      this.id = this.streamerService.advertiserId;
      //api call
      this.initForm();
      this.getAdvertiserById();
    } else {
      this.initForm();
    }
  }

  getAdvertiserById() {
    this.loader=true
    this.apiService.sendRequest(requests.getAdvertiserById, 'post', {retailerId: this.id})
    .subscribe((res: any) => {
      this.loader=false
      this.advertiserData = res?.data
      this.selectedStatus=this.Statuses[this.advertiserData?.retailerStatusId-1]
      this.findCountryName(res?.data?.countryId)
      // console.log("Response: ",this.advertiserData)
      this.vzot=this.advertiserData?.vzotThreshold
      this.advertiserDetailsForm = this.formbuilder.group({
        firstName: [ {value:this.advertiserData?.name,disabled:true}, [Validators.required]],
        lastName:  [ null,],
        email: [{value:this.advertiserData?.email, disabled:true}, [Validators.required]],
        phoneNo: [this.advertiserData?.telephoneNo, ],
        address: [this.advertiserData?.address],
        city: [ this.advertiserData?.city],
        state: [ this.advertiserData?.state],
        zipCode: [ this.advertiserData?.zipCode],
        countryId: [ this.advertiserData?.countryId],
        dateStarted: [ null],
        url: [ {value:this.advertiserData?.websiteLink, disabled:true}, [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
        dateTerminated: [ {value:this.advertiserData?.dateTerminated?.split('T', 1)[0],disabled:true}],
        status: [this.advertiserData?.retailerStatusId],
        notes: [this.advertiserData?.notes],
        vzotThreshold:[this.advertiserData?.vzotThreshold],
        country:[this.advertiserData?.countryCode?this.mapCountry(this.advertiserData?.countryCode):null]
      })
    })

  }
  private initForm() {
    this.advertiserDetailsForm = this.formbuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{3,4}$")]],
      phoneNo: [null,],
      address: [null],
      city: [null],
      state: [null,],
      zipCode: [null, ],
      countryId: [null,],
      dateStarted: [null,],
      url: [null, [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)]],
      dateTerminated: [null],
      status: [null],
      notes: [undefined,],
      vzotThreshold:[null],
      country:[null]
    })
  }
  fetchCountries() {
    this.countryObservable = this.sharedService.countries.subscribe((res) => {
      this.countries = res
    })
  }
  CheckNumber(e, telephone?:boolean){

    const charCode = e.which ? e.which : e.keyCode;
    if(charCode==43){
      return true
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57  )) {
      return false
    }

    return true
  }

  CheckZipCode(e){

    const charCode = e.which ? e.which : e.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57  )) {
      return false
    }
    return true
  }

  updateStatus(status:any,index:number){
    this.selectedStatus=status
    this.advertiserDetailsForm.controls['status'].setValue(index)
  }
  mapCountry(phone:string){
    console.log(phone)
    const country = this.countries.find(item=>item.phone==phone)
    return country
  }
  findCountryName(id: number) {
    // console.log(this.countries, "find country by name")
    // console.log(id)
    const countryObj = this.countries.find(item =>
      item.id == id)
    // console.log(countryObj)
    this.selectedCountry = countryObj?.name
    // console.log(this.selectedCountry)
  }
  selectCountry(country: any) {
    // console.log(this.countries)
    this.advertiserDetailsForm.get('phoneNo').updateValueAndValidity();
    console.log(country.id)
  }

  submit() {
    this.formSubmitted=true
    const body = {
      retailerId:this.id,
      vzotThreshold:this.advertiserDetailsForm.value.vzotThreshold,
      name: this.advertiserDetailsForm.value.firstName,
      telephoneNo: this.advertiserDetailsForm.value.phoneNo??undefined,
      address: this.advertiserDetailsForm.value.address?this.advertiserDetailsForm.value.address.trim():undefined,
      city: this.advertiserDetailsForm.value.city?this.advertiserDetailsForm.value.city.trim():undefined,
      state: this.advertiserDetailsForm.value.state?this.advertiserDetailsForm.value.state.trim():undefined,
      zipCode: this.advertiserDetailsForm.value.zipCode??undefined,
      websiteLink:this.advertiserDetailsForm.value.url?this.advertiserDetailsForm.value.url.trim():undefined,
      countryId:this.advertiserDetailsForm.value.countryId??undefined,
      notes:this.advertiserDetailsForm.value.notes?this.advertiserDetailsForm.value.notes.trim():undefined,
      retailerStatusId:this.advertiserDetailsForm.value.adress?this.advertiserDetailsForm.value.address.trim():undefined,
      email:this.advertiserDetailsForm.value.email,
    }
    if(this.advertiserDetailsForm.valid){
    this.apiService.sendRequest(requests.getUpdateAdvertiser, 'post', body)
      .subscribe( {
        next: (res: any) => {
          // console.log("files,r", res);

        },
        error: (err: any) => {
          console.log(err.error.messege, "ERROR")
          console.log(err, "ERROR")
          this.toastrService.error(err['error']['message'], "Error!");
        },
        complete: () => {
          // console.log('completed');
          this.toastrService.success("Advertiser Updated Successfully.")
          this.close()
        }
      })
    }
  }
  close(){
    this.notifyParent.emit("Close pls")
  }
  cancelEditing(){
    this.notifyParent.emit("Cancel")
  }
  updateThreshold(){

    const body = {
      retailerId:this.id,
      vzotThreshold:this.advertiserDetailsForm.value.vzotThreshold
    }
    this.apiService.sendRequest(requests.getUpdateAdvertiser, 'post', body)
      .subscribe((res: any) => {
        // console.log(res);
        this.toastrService.success('Master Threshold Updated')

      })
  }

  cancel(){
    this.advertiserDetailsForm.controls['vzotThreshold'].setValue(this.vzot)
  }
  routeToAdInventory(){

    this.router.navigate(['/demo'])
  }
  trimSpaces(event) {
    if (event.target.name == 'email')
      this.advertiserDetailsForm.controls[event.target.name].setValue(event.target.value.trim().toLowerCase())
    else
      this.advertiserDetailsForm.controls[event.target.name].setValue(event.target.value.trimStart())
  }
  selectCode(event:any){
    console.log(event)

  }
  countryRequiredValidator() {
    return (control) => {
      const phoneNumber = this.advertiserDetailsForm.get('phoneNo').value;
      console.log(phoneNumber, "phone number")
      const country = control.value;
      let isPhoneNumberEntered = !!phoneNumber;
      if (isPhoneNumberEntered && !country) {
        return { countryRequired: true };
      }
      return null;
    };
  }

  phoneNumberRequiredValidator() {
    return (control) => {
      const country = this.advertiserDetailsForm.get('country').value;
      const phoneNumber = control.value;
      console.log("phone number", phoneNumber)
      const isCountrySelected = !!country;
      console.log(!!country, "Country")

      if (isCountrySelected && !phoneNumber ) {
        return { phoneNumberRequired: true };
      }
      else if(phoneNumber===''){
        this.advertiserDetailsForm.get('country').updateValueAndValidity()
      }
      return null;
    };
  }

  get countryInvalid() {
    const countryControl = this.advertiserDetailsForm.get('country');
    return countryControl.hasError('countryRequired') ;
  }

  get phoneNumberInvalid() {
    const phoneNumberControl = this.advertiserDetailsForm.get('phoneNo');
    console.log( phoneNumberControl.hasError('phoneNumberRequired') && phoneNumberControl.touched, "phone number invalid")
    return phoneNumberControl.hasError('phoneNumberRequired') ;
  }
}
