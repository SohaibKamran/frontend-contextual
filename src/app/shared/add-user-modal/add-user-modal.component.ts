import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
import { ROLES } from 'src/app/core/constants';

import { Router } from '@angular/router';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import { BehaviorSubject } from 'rxjs';
import { UploadService } from 'src/app/core/services/upload.service';
import { forkJoin, map,concatMap, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserAccountsService } from 'src/app/pages/user-accounts/user-accounts.service';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  standalone:true,
  imports:[CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent {
  userDetailsForm: FormGroup
  onboardingColor = '#1890FF';
  activeColor = 'green';
  inactiveColor = 'red';
  userIdObservable: any;
  userId: number
  userData: any;
  countries = []
  selectedCountry:string= "Pakistan"
  userFlag:boolean=false
  countryObservable:any
  Statuses:any
  profilePictureSubscription:any
  profilePicture=new BehaviorSubject<any>(null)
  pfp:string
  loader=false
  formSubmitted:boolean=false
  imageURL:string="assets/images/user/avatar-3.jpg"
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @Input() screen:boolean
  constructor(public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService,
    private userAccountsService:UserAccountsService,
    private router:Router,
    private fileUploadService:UploadService,
    private toastrService:ToastrService) {

  }
  ngOnDestroy() {
    this.countryObservable.unsubscribe();
    
  }
  ngOnInit(): void {
    this.initForm();
    this.fetchCountries()
  }

 
showPreview(event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.userDetailsForm.patchValue({
     pfp : file
  });
  console.log(file)
  // File Preview
  const reader = new FileReader();
  reader.onload = () => {
    this.imageURL = reader.result as string;
  }
  reader.readAsDataURL(file)
}


uploadDocuments(files: Array<any>) {
  const apis = []
  
    apis.push(this.fileUploadService.uploadProfilePicture({ file: files }))
    console.log(apis)
  return forkJoin(apis).pipe(
    map((res) => {
      // console.log("file response", res);
      // [{
      //   "documentTypeId": 1,
      //   "documentId": 1
      // },
      // {
      //   "documentTypeId": 2,
      //   "documentId": 2
      // }]
      return res
    }, err => {
      // console.log(err);

    })
  )
}

  updateStatus(statusId:number) {
    this.apiService.sendRequest(requests.updateTaggerStatus, 'post', {
      statusId: statusId,
      userId: this.userId
    }).subscribe((res) => {
      // // console.log(res)
    })
    this.userData.userStatusId=statusId
  }
  selectCountry(country: any) {
    // console.log(this.countries)
    this.selectedCountry = country?.name
    this.userDetailsForm.controls['countryId'].setValue(country?.id)

    // console.log(this.selectedCountry)

  }
  fetchCountries() {
    this.countryObservable=this.sharedService.countries.subscribe((res)=>{
      this.countries=res
      console.log(this.countries)
    })
  }

  private initForm() {
    this.userDetailsForm = this.formbuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNo: [null,],
      country:[null,],
      email: [null, [Validators.required]],  
      address: [null, ],
      city: [null, ],
      state: [null,],
      zipCode: [null,],
      countryId: [null,],
      dateStarted: [null],
      dateTerminated:[null],
      title:[null],
      company:[null,],
      url:["https://contxtual.com",[Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)]],
      notes:[null],
      pfp:[null],
    })
    this.setDynamicValidations()
  }

  setDynamicValidations(){
    const company = this.userDetailsForm.get('company');
    const title= this.userDetailsForm.get('title');
    if(this.screen){
      company.setValidators([Validators.required])
      title.setValidators([Validators.required])
    }
    else{
      company.clearValidators()
      title.clearValidators()
    }
  }

  CheckNumber(e, telephone?:boolean){
    // if(telephone){
    //   this.userDetailsForm.get('country').updateValueAndValidity();
    // }
    console.log(e, "Event")
    
    const charCode = e.which ? e.which : e.keyCode;
    if(charCode==43){
      return true
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57  )) {
      return false
    }
    return true
  }
  submit() {

    let role:number
    if(this.screen){
      role=ROLES.VIEWER
      this.userId=undefined
      console.log(role)
    }
    else{
      role=ROLES.TAGGER
    }
    const body = {
      role:role,
      firstName: this.userDetailsForm.value.firstName.trim(),
      lastName: this.userDetailsForm.value.lastName.trim(),
      phoneNo: this.userDetailsForm.value.phoneNo??undefined,
      email:this.userDetailsForm.value.email,
      address: this.userDetailsForm.value.address?this.userDetailsForm.value.address.trim():undefined,
      city: this.userDetailsForm.value.city?this.userDetailsForm.value.city.trim():undefined,
      state: this.userDetailsForm.value.state?this.userDetailsForm.value.state.trim():undefined,
      zipCode: this.userDetailsForm.value.zipCode??undefined,
      countryId:this.userDetailsForm.value.countryId??undefined,
      url:this.userDetailsForm.value.url?this.userDetailsForm.value.url.trim():undefined,
      notes:this.userDetailsForm.value.notes?this.userDetailsForm.value.notes.trim():undefined,
      title:this.userDetailsForm.value.title?this.userDetailsForm.value.title.trim():undefined,
      company:this.userDetailsForm.value.company?this.userDetailsForm.value.company.trim():undefined,
      //startedDate: this.userDetailsForm.value.dateStarted,
    }
    console.log(this.userDetailsForm)
    if(this.userDetailsForm.valid){
        this.newUser(body).subscribe({
          next: (res: any) => {
            // console.log("files,r", res);
            
          },
          error: (err: any) => {
            this.toastrService.error(err['error']['message'], "Error!");
          },
          complete: () => {
            // console.log('completed');
            let role=""
            if(this.screen){
              role="User"
            }else{
              role="Annotator"
            }
            this.toastrService.success(role+" Added Successfully.")
            this.close()
          }
        })
    }
  }

  newUser(body:any){
    return this.uploadDocuments(this.userDetailsForm.get('pfp').value).pipe(concatMap((res: any) => {
      // console.log("signed urlsss", res);
      body.profilePicture=res[0][0]
      return this.apiService.sendRequest(requests.createUser, 'post', body)

    }), concatMap((res: any) => {
      // console.log("response");
      return of(res);
    }));
  }

  close(){
    this.userAccountsService.setUserId(0)
    if(this.userId){
      this.notifyParent.emit("Close modal");
    }else{
      this.sharedService.userAdded.next(1)
      console.log("Cancle Clicked")
      this.modalService.dismissAll('Cancel Clicked')
    }
  }
  cancel(){
    this.userAccountsService.setUserId(0)
    if(this.userId){
      this.notifyParent.emit("Cancel");
    }else{
      console.log("Cancle Clicked")
      this.modalService.dismissAll('Cancel Clicked')
    }
  }
  CheckZipCode(e){

    const charCode = e.which ? e.which : e.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57  )) {
      return false
    }
    return true
  }
  routeToDatabase(){
    this.router.navigate(['/database'])
  }
  trimSpaces(event) {
    if (event.target.name == 'email')
      this.userDetailsForm.controls[event.target.name].setValue(event.target.value.trim())
    else
      this.userDetailsForm.controls[event.target.name].setValue(event.target.value.trimStart())
  }
  selectCode(event){
    // this.userDetailsForm.get('phoneNo').updateValueAndValidity();

  }
  countryRequiredValidator() {
    return (control) => {
      let phoneNumber = this.userDetailsForm.value.phoneNo;
      if(phoneNumber==""){
        phoneNumber=null
      }
      console.log(parseInt(phoneNumber))
      console.log(phoneNumber, "value")
      const country = control.value;
      const isPhoneNumberEntered=!!phoneNumber
      console.log(isPhoneNumberEntered, "phone number entered")
      if (isPhoneNumberEntered && !country) {
        return { countryRequired: true };
      }
      return null;
    };
  }

  phoneNumberRequiredValidator() {
    return (control) => {
      const country = this.userDetailsForm.value.country;
      const phoneNumber = control.value;
      console.log("phone number", parseInt(phoneNumber))
      const isCountrySelected = !!country;
      console.log(!!country, "Country")

      if (isCountrySelected && !phoneNumber ) {
        return { phoneNumberRequired: true };
      }
      else if(phoneNumber===''){
        this.userDetailsForm.get('country').updateValueAndValidity()
      }
      return null;
    };
  }

  get countryInvalid() {
    const countryControl = this.userDetailsForm.get('country');
    return countryControl.hasError('countryRequired') ;
  }

  get phoneNumberInvalid() {
    const phoneNumberControl = this.userDetailsForm.get('phoneNo');
    console.log( phoneNumberControl.hasError('phoneNumberRequired') && phoneNumberControl.touched, "phone number invalid")
    return phoneNumberControl.hasError('phoneNumberRequired') ;
  }

}
