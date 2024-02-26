import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { ROLES } from 'src/app/core/constants';
import { SharedService } from 'src/app/core/services/shared.service';
import { ManageAnnotatorsService } from '../manage-annotators.service';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/core/services/upload.service';
import { of, map, concatMap, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-edit-annotator',
  templateUrl: './add-edit-annotator.component.html',
  styleUrls: ['./add-edit-annotator.component.scss']
})
export class AddEditAnnotatorComponent {
  taggerDetailsForm: FormGroup
  onboardingColor = '#1890FF';
  activeColor = 'green';
  inactiveColor = 'red';
  taggerIdObservable: any;
  taggerData: any;
  taggerId: number
  countries = []
  selectedCountry = "Pakistan"
  taggerFlag: boolean = false
  openModel: boolean = false
  Statuses: any
  imageURL: string = "assets/images/user/avatar-3.jpg"
  loader: boolean = false
  countryCodeSelected:boolean=false
  phoneNumberSelected:boolean=false
  formSubmitted:boolean=false
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  countryObservable: any
  constructor(public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService,
    public modelService: NgbModal,
    private manageAnnotatorService: ManageAnnotatorsService,
    private router: Router,
    private fileUploadService: UploadService,
    private toastrService: ToastrService) {

  }
  ngOnDestroy() {
    this.countryObservable.unsubscribe();
  }
  ngOnInit(): void {
    this.initForm();
    this.fetchCountries()
    this.fetchTaggerId()
    this.Statuses = this.sharedService.getStatuses()
  }
  
  fetchTaggerId() {
    this.taggerId = this.manageAnnotatorService.getAnnotatorId()
    if (this.taggerId != 0) {
      this.taggerFlag = true
      this.fetchData()
    }
    else {
      this.taggerFlag = false
    }

    // this.taggerIdObservable = this.sharedService.taggerId.subscribe((data) => {
    //   if (data) {
    //     // console.log(data);
    //     this.taggerId = data
    //     this.taggerFlag = true
    //     this.fetchData()
    //   }
    //   else {
    //     this.taggerFlag = false
    //   }
    // });
  }
  updateStatus(statusId: number) {
    this.apiService.sendRequest(requests.updateTaggerStatus, 'post', {
      statusId: statusId,
      userId: this.taggerId
    }).subscribe((res) => {
      // // console.log(res)
    })
    this.taggerData.userStatusId = statusId
  }

  fetchData() {
    this.loader = true
    this.apiService.sendRequest(requests.getUserById, 'post', { userId: this.taggerId })
      .subscribe((res: any) => {
        this.loader = false
        this.taggerData = res?.data;
        this.findCountryName(res?.data?.countryId)
        // console.log("taggerData: " + this.taggerData);
        if (this.taggerData?.profilePicture)
          this.imageURL = this.taggerData?.profilePicture
        this.taggerDetailsForm = this.formbuilder.group({
          firstName: [this.taggerData?.firstName, Validators.required],
          lastName: [this.taggerData?.lastName, Validators.required],
          email: [{ value: this.taggerData?.email, disabled: true }, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
          phoneNo: [this.taggerData?.phoneNo],
          address: [this.taggerData?.address],
          city: [this.taggerData?.city],
          state: [this.taggerData?.state],
          zipCode: [this.taggerData?.zipCode],
          countryId: [this.taggerData?.countryId],
          notes: [this.taggerData?.notes ? this.taggerData?.notes : "Notes not Found", [Validators.required]],
          dateStarted: [{ value: this.taggerData?.startedDate.split('T', 1)[0], disabled: true }],
          pfp: [null],
          country:[this.taggerData?.countryCode?this.mapCountry(this.taggerData?.countryCode):null]
        })
        this.manageAnnotatorService.setAnnotatorId(0)
      });
  }
  mapCountry(phone:string){
    console.log(phone)
    const country = this.countries.find(item=>item.phone==phone)
    return country
  }
  selectCountry(country: any) {
    // console.log(this.countries)
    this.selectedCountry = country.name
    this.taggerDetailsForm.controls['countryId'].setValue(country.id)
  }
  private initForm() {
    this.taggerDetailsForm = this.formbuilder.group({
      firstName: [undefined, [Validators.required]],
      lastName: [undefined, [Validators.required]],
      email: [undefined, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{3,4}$")]],
      phoneNo: [undefined,],
      address: [undefined],
      city: [undefined, ],
      state: [undefined],
      countryCode:[undefined],
      zipCode: [undefined],
      countryId: [undefined,],
      dateStarted: [undefined,],
      notes: [undefined],
      pfp: [undefined],
      country:[undefined]
    })
  }

  CheckNumber(e, telephone?:boolean) {

    // if(telephone){
    //   this.taggerDetailsForm.get('country').updateValueAndValidity();

    // }
    
    const charCode = e.which ? e.which : e.keyCode;
    if(charCode==43){
      return true
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }
  CheckZipCode(e) {

    const charCode = e.which ? e.which : e.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }
  fetchCountries() {
    this.countryObservable = this.sharedService.countries.subscribe((res) => {
      this.countries = res
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

  routeToProductAnnotator() {
    if (this.taggerId) {
      console.log(this.taggerId)
      localStorage.setItem('simulatedtaggerid', this.taggerId + "")
      this.router.navigate(['/indexer'])
    }
  }

  submit() {
    let role: number
    this.formSubmitted=true
    if (!this.taggerId) {
      role = ROLES.TAGGER
      this.taggerId = undefined
    }
    else {
      role = undefined
      this.taggerDetailsForm.value.email = undefined
    }

    const body = {
      userId: this.taggerId,
      role: role,
      firstName: this.taggerDetailsForm.value.firstName.trim(),
      lastName: this.taggerDetailsForm.value.lastName.trim(),
      phoneNo: this.taggerDetailsForm.value.phoneNo??undefined,
      email: this.taggerDetailsForm.value.email,
      address: this.taggerDetailsForm.value.address?this.taggerDetailsForm.value.address.trim():undefined,
      city: this.taggerDetailsForm.value.city?this.taggerDetailsForm.value.city.trim():undefined,
      state: this.taggerDetailsForm.value.state?this.taggerDetailsForm.value.state.trim():undefined,
      zipCode: this.taggerDetailsForm.value.zipCode??undefined,
      countryId: this.taggerDetailsForm.value.countryId??undefined,
      notes: this.taggerDetailsForm.value.notes?this.taggerDetailsForm?.value.notes.trim():undefined,
      //startedDate: this.taggerDetailsForm.value.dateStarted,
    }

    if (this.taggerId) {
      this.updateUser(body).subscribe({
        next: (res: any) => {
          // console.log("files,r", res);

        },
        error: (err: any) => {
          console.log(err['error'], "ERROR")
          this.toastrService.error(err['error']['message'], "Error!");
        },
        complete: () => {
          // console.log('completed');
          this.toastrService.success("Annotator Updated Successfully.")
          this.close()
        }
      })
    }
    else {
      this.newUser(body).subscribe({
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
          this.toastrService.success("Annotator Added Successfully.")
          this.close()
        }
      })
    }
  }
  close() {
    if (this.taggerId) {
      this.notifyParent.emit("Close");
      this.modalService.dismissAll('Cancel Clicked')
    } else
      this.modalService.dismissAll('Cancel Clicked')
  }
  delete(){
    if(this.taggerId){
      const body = {taggerId: this.taggerId};
      this.apiService.sendRequest(requests.deleteTagger, 'post', body).subscribe((res: any) => {
        this.notifyParent.emit("Delete");
        this.toastrService.success("Annotator deleted successfully.")
      });

    }
  }

  cancel() {
    if (this.taggerId) {
      this.notifyParent.emit("Cancel");
      this.modalService.dismissAll('Cancel Clicked')

    } else
      this.modalService.dismissAll('Cancel Clicked')
  }

  routeToDatabase() {

    this.router.navigate(['/database'])
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
  newUser(body: any) {
    return this.uploadDocuments(this.taggerDetailsForm.get('pfp').value).pipe(concatMap((res: any) => {
      // console.log("signed urlsss", res);
      body.profilePicture = res[0][0]
      return this.apiService.sendRequest(requests.createUser, 'post', body)

    }), concatMap((res: any) => {
      // console.log("response");
      return of(res);
    }));
  }

  updateUser(body: any) {
    console.log(this.taggerDetailsForm.get('pfp'), " HELLO")
    if (this.taggerDetailsForm.get('pfp')) {
      return this.uploadDocuments(this.taggerDetailsForm.get('pfp').value).pipe(concatMap((res: any) => {
        // console.log("signed urlsss", res);
        console.log(this.taggerDetailsForm.get('pfp').value)
        console.log(res)
        body.profilePicture = res[0][0]
        return this.apiService.sendRequest(requests.updateUserByAdmin, 'post', body)

      }), concatMap((res: any) => {
        // console.log("response");
        return of(res);
      }));
    }
    else {
      return this.apiService.sendRequest(requests.updateUserByAdmin, 'post', body)
    }

  }
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.taggerDetailsForm.patchValue({
      pfp: file
    });
    console.log(file)
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  trimSpaces(event) {
    if (event.target.name == 'email')
      this.taggerDetailsForm.controls[event.target.name].setValue(event.target.value.trim().toLowerCase())
    else
      this.taggerDetailsForm.controls[event.target.name].setValue(event.target.value.trimStart())
  }
  selectCode(event:any){
    console.log(event)
    // this.countryCodeSelected=true
    // this.taggerDetailsForm.get('phoneNo').updateValueAndValidity();

  }
  countryRequiredValidator() {
    return (control) => {
      const phoneNumber = this.taggerDetailsForm.get('phoneNo').value;
      const country = control.value;
      const isPhoneNumberEntered = !!phoneNumber;
      if (isPhoneNumberEntered && !country) {
        return { countryRequired: true };
      }
      return null;
    };
  }

  phoneNumberRequiredValidator() {
    return (control) => {
      const country = this.taggerDetailsForm.get('country').value;
      const phoneNumber = control.value;
      console.log("phone number", phoneNumber)
      const isCountrySelected = !!country;
      console.log(!!country, "Country")

      if (isCountrySelected && !phoneNumber && phoneNumber!='') {
        return { phoneNumberRequired: true };
      }
      else if(phoneNumber===''){
        this.taggerDetailsForm.get('country').updateValueAndValidity()
      }
      return null;
    };
  }

  get countryInvalid() {
    const countryControl = this.taggerDetailsForm.get('country');
    return countryControl.hasError('countryRequired') ;
  }

  get phoneNumberInvalid() {
    const phoneNumberControl = this.taggerDetailsForm.get('phoneNo');
    console.log( phoneNumberControl.hasError('phoneNumberRequired') && phoneNumberControl.touched, "phone number invalid")
    return phoneNumberControl.hasError('phoneNumberRequired') ;
  }
}






