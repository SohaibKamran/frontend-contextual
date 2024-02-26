import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { SharedService } from 'src/app/core/services/shared.service';
import { ROLES } from 'src/app/core/constants';
import { UserAccountsService } from '../user-accounts.service';
import { Router } from '@angular/router';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import { BehaviorSubject } from 'rxjs';
import { UploadService } from 'src/app/core/services/upload.service';
import { forkJoin, map,concatMap, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-edit-user-details',
  templateUrl: './add-edit-user-details.component.html',
  styleUrls: ['./add-edit-user-details.component.scss']
})
export class AddEditUserDetailsComponent {
  userDetailsForm: FormGroup
  onboardingColor = '#1890FF';
  activeColor = 'green';
  inactiveColor = 'red';
  userIdObservable: any;
  userId: number
  userData: any;
  countries = []
  selectedCountry:string= "USA"
  userFlag:boolean=false
  countryObservable:any
  Statuses:any
  profilePictureSubscription:any
  profilePicture=new BehaviorSubject<any>(null)
  pfp:string
  loader=false
  imageURL:string="assets/images/user/avatar-3.jpg"
  formSubmitted:boolean=false
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
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
    this.fetchUserId()
    this.Statuses=this.sharedService.getStatuses()
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
  fetchUserId(){

    this.userId=this.userAccountsService.getUserId()
    if(this.userId!=0){
      console.log(this.userId, "User id")
      this.userFlag = true
      this.fetchData()
    }
    else{
      this.userFlag = false
    } 
  }

  fetchData() {
    this.loader=true
    this.apiService.sendRequest(requests.getUserById, 'post', { userId: this.userId })
      .subscribe((res: any) => {
        this.loader=false
        this.userData = res?.data;
        this.findCountryName(res?.data?.countryId)
        // console.log("userData: " + this.userData);
        if(this.userData?.profilePicture)
          this.imageURL=this.userData?.profilePicture
        this.userDetailsForm = this.formbuilder.group({
          firstName: [this.userData?.firstName, [Validators.required]],
          lastName: [this.userData?.lastName, [Validators.required]],
          email: [{value:this.userData?.email, disabled:true}, [Validators.required]],
          phoneNo: [this.userData?.phoneNo,],
          address: [this.userData?.address],
          city: [this.userData?.city],
          state: [this.userData?.state],
          zipCode: [this.userData?.zipCode],
          countryId: [this.userData?.countryId],
          country:[this.userData?.countryCode?this.mapCountry(this.userData?.countryCode):null],
          dateStarted: [this.userData?.startedDate.split('T', 1)[0]],
          notes:[this.userData?.notes ? this.userData?.notes : "Notes not Found"],
          url:[this.userData?.url,[Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)]],
          dateTerminated:[this.userData?.dateTerminated],
          pfp:[null],
          title:[this.userData?.title, [Validators.required]],
          company:[this.userData?.company, [Validators.required]]
        })
        this.userAccountsService.setUserId(0)
        if (this.userId) {
          this.userDetailsForm.controls['email'].disable()
          this.userDetailsForm.controls['dateStarted'].disable()
          // console.log("I am Edit Section")
        }
      });
  }
  mapCountry(phone:string){
    console.log(phone)
    const country = this.countries.find(item=>item.phone==phone)
    return country
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
    })
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

  private initForm() {
    console.log(this.selectCountry)
    this.userDetailsForm = this.formbuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{3,4}$")]],  
      phoneNo: [undefined],
      address: [undefined],
      city: [undefined],
      state: [undefined],
      zipCode: [undefined],
      countryId: [undefined, ],
      dateStarted: [undefined],
      dateTerminated:[undefined],
      title:[undefined],
      country:[undefined],
      company:[undefined],
      url:["https://contxtual.com",[Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)]],
      notes:[undefined],
      pfp:[undefined]
    })
  }

  CheckNumber(e, telephone?:true){
    // if(telephone){
    //   this.userDetailsForm.get('country').updateValueAndValidity();
    // }
    
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
    this.formSubmitted=true
    let role:number
    if(!this.userId){
      role=ROLES.VIEWER
      this.userId=undefined
      console.log(role)
    }
    else{
      role=undefined
    }
    const body = {
      userId:this.userId,
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
      if(this.userId){
        this.updateUser(body).subscribe({
          next: (res: any) => {
            // console.log("files,r", res);
            
          },
          error: (err: any) => {
            this.toastrService.error(err['error']['message'], "Error!");
          },
          complete: () => {
            // console.log('completed');
            this.toastrService.success("User Updated Successfully.")
            this.close()
          }
        })
      }
      else{
        this.newUser(body).subscribe({
          next: (res: any) => {
            // console.log("files,r", res);
            
          },
          error: (err: any) => {
            this.toastrService.error(err['error']['message'], "Error!");
          },
          complete: () => {
            // console.log('completed');
            this.toastrService.success("User Added Successfully.")
            this.close()
          }
        })
      }
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

  updateUser(body:any){
    console.log(this.userDetailsForm.get('pfp')," HELLO")
    if(this.userDetailsForm.get('pfp')){
      return this.uploadDocuments(this.userDetailsForm.get('pfp').value).pipe(concatMap((res: any) => {
        // console.log("signed urlsss", res);
        console.log(this.userDetailsForm.get('pfp').value)
        console.log(res)
        body.profilePicture=res[0][0]
        return this.apiService.sendRequest(requests.updateUserByAdmin, 'post', body)
  
      }), concatMap((res: any) => {
        // console.log("response");
        return of(res);
      }));
    }
    else{
      return this.apiService.sendRequest(requests.updateUserByAdmin, 'post', body)

    }

    }
  close(){
    this.userAccountsService.setUserId(0)
    if(this.userId){
      this.notifyParent.emit("Close modal");
    }else{
      console.log("Cancle Clicked")
      this.modalService.dismissAll('Cancel Clicked')
    }
  }
  delete(){
    if(this.userId){
      const body = {userId: this.userId};
      this.apiService.sendRequest(requests.deleteUser, 'post', body).subscribe((res: any) => {
        this.notifyParent.emit("Delete");
        this.toastrService.success("User deleted successfully.")
      });

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
  CheckZipCode(e, telephone?:boolean){

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
      this.userDetailsForm.controls[event.target.name].setValue(event.target.value.trim().toLowerCase())
    else
      this.userDetailsForm.controls[event.target.name].setValue(event.target.value.trimStart())
  }
  routeToDemoUser(){
    if(this.userId){
      localStorage.setItem('simulateduserid', this.userId + "")
      this.router.navigate(['/user/shopping'])
    }
  }
  selectCode(event:any){
    // this.userDetailsForm.get('phoneNo').updateValueAndValidity();
  }
  phoneNumberRequiredValidator() {
    return (control) => {
      const country = this.userDetailsForm.get('country').value;
      const phoneNumber = control.value;
      console.log("phone number", phoneNumber)
      const isCountrySelected = !!country;
      console.log(!!country, "Country")

      if (isCountrySelected && !phoneNumber) {
        return { phoneNumberRequired: true };
      }
      else if(phoneNumber===''){
        this.userDetailsForm.get('country').updateValueAndValidity()
      }
      return null;
    };
  }
  countryRequiredValidator() {
    return (control) => {
      const phoneNumber = this.userDetailsForm.get('phoneNo').value;
      console.log(phoneNumber, "phone number")
      const country = control.value;
      let isPhoneNumberEntered = !!phoneNumber;
      if (isPhoneNumberEntered && !country) {
        return { countryRequired: true };
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
    console.log( phoneNumberControl.hasError('phoneNumberRequired'), "phone number invalid")
    return phoneNumberControl.hasError('phoneNumberRequired') ;
  }

}
