
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { ToastrService } from 'ngx-toastr';
import { ROLES } from '../register/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeactiveUserModalComponent } from './deactive-user-modal/deactive-user-modal.component';

// import { catchError, concatMap, first, map, mergeMap } from 'rxjs/operators';

// import { AuthenticationService } from '../../core/services/auth.service';
// import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
// import { LAYOUT_MODE } from '../../layouts/layouts.model';
// import { ApiService } from 'src/app/core/services/api.service';
// import { requests } from 'src/app/core/config/config';
// import { CommonStore } from 'src/app/core/services/common.store';
// import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;
  isMobileDevice: boolean;

  // set the currenr year
  // year: number = new Date().getFullYear();
  // // Carousel navigation arrow show
  // showNavigationArrows: any;
  // loginForm!: UntypedFormGroup;
  // submitted = false;
  // error = '';
  // returnUrl!: string;
  // layout_mode!: string;
  // fieldTextType!: boolean;

  // constructor(private formBuilder: UntypedFormBuilder,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private apiService: ApiService,
  //   public commonStore: CommonStore,
  //   private authenticationService: AuthenticationService,
  //   private authFackservice: AuthfakeauthenticationService,
  // ) {
  //   // redirect to home if already logged in
  //   if (this.authenticationService.currentUserValue) {
  //     this.router.navigate(['/']);
  //   }
  // }

  // ngOnInit(): void {
  //   this.layout_mode = LAYOUT_MODE
  //   if (this.layout_mode === 'dark') {
  //     document.body.setAttribute("data-layout-mode", "dark");
  //   }
  //   //Validation Set
  //   this.loginForm = this.formBuilder.group({
  //     email: ['', [Validators.required, Validators.minLength(3)]],
  //     password: ['', [Validators.required, Validators.minLength(3)]],
  //     rememberMe: [false,],
  //   });
  //   // get return url from route parameters or default to '/'
  //   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //   document.body.setAttribute('data-layout', 'vertical');
  // }

  // // convenience getter for easy access to form fields
  // get f() { return this.loginForm.controls; }

  // /**
  //  * Form submit
  //  */
  // onSubmit() {
  //   this.submitted = true;
  //   // stop here if form is invalid
  //   this.commonStore.loaderStart();
  //   this.onLogin().subscribe(res=>
  //     {
  //       this.commonStore.loaderEnd();
  //       this.router.navigate(['/']);
  //     })

  //   // return this.apiService.sendRequest(requests.login, 'post',
  //   //   { username: this.f.email.value, password: this.f.password.value, rememberMe: this.f.rememberMe.value }).pipe(concatMap((res: any) => {
  //   //     // console.log("login error", res);
  //   //     localStorage.setItem("admin", JSON.stringify(res.response));

  //   //   },map(res=>{
  //   //     this.commonStore.loaderEnd();
  //   //     this.router.navigate(['/']);
  //   //     return res
  //   //   })))
  // }

  // private onLogin() {
  //   return this.apiService.sendRequest(requests.login, 'post',
  //     { username: this.f.email.value, password: this.f.password.value, rememberMe: this.f.rememberMe.value }).pipe(concatMap((res: any) => {
  //       // console.log("login error", res);
  //       localStorage.setItem("admin", JSON.stringify(res.response));
  //       return this.apiService.sendRequest(requests.getPermisionsById + res.response?.user?.id, 'get');
  //     }), concatMap((res: any) => {
  //       // console.log("response success",res);
  //       let admin=JSON.parse(localStorage.getItem('admin'));
  //       admin['permissions']=res.data?.permissions;
  //       localStorage.setItem("admin", JSON.stringify(admin));

  //       return of(res);
  //     }));
  // }

  // /**
  //  * Password Hide/Show
  //  */
  // toggleFieldTextType() {
  //   this.fieldTextType = !this.fieldTextType;
  // }

  usernameValue = '';
  userPassword = '';

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  agreedTerms: boolean = false;
  isReachedEnd: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private modalService: NgbModal
    // private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.userValue) {
    //   this.router.navigate(['/guest/guestV1/guestV1-login']);
    // }
  }

  ngOnInit() {

    this.isMobileDevice = this.checkIfMobileDevice();
    console.log(this.isMobileDevice)
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private checkIfMobileDevice(): boolean {
    const userAgent = navigator.userAgent;
    return /iPhone|iPad|iPod|Android/i.test(userAgent);
  }

  ngAfterViewInit() {
    this.videoElement.nativeElement.muted = true;

    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function () {
      // toggle the type attribute
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);

      // toggle the icon
      this.classList.toggle('ti-eye-off');
    });
  }

  agreeToTerms(agree) {
    if (agree) {
      this.agreedTerms = true;
      this.modalService.dismissAll('close');
      this.error = ""
    }
    else {
      this.error = "Please read the terms and condition first"
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  openScrollableContent(content1) {
    const element = document.getElementById('checkbox1') as HTMLInputElement;
    element.checked = false;
    this.modalService.open(content1, { scrollable: true, windowClass: 'modal-md' });
  }

  onScroll(event: any) {
    //Checking if user has reached the bottom of terms and agreement page
    if (event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight - 50)) {
      this.isReachedEnd = true
    }
  }

  onSubmit(role: number) {
    this.submitted = true;

    // console.log("on submit called")
    this.error = '';
    this.loading = true;
    this.apiService.sendRequest(requests.login, 'post',
      {
        email: this.usernameValue,
        password: this.userPassword,
        rememberMe: true,
        role: [ROLES.viewer, ROLES.superAdmin, ROLES.admin,ROLES.streamer]
      })
      .subscribe({
        next: (res: any) => {
        if (res['data']) {
          // console.log(res.data.token)
          // console.log("response", res.data)
         // this.toastrService.success("Login Successful")
          localStorage.setItem('token', res.data?.token)
          localStorage.setItem('userId', res.data?.userId)
          localStorage.setItem('role', res.data?.roleId)
          localStorage.setItem('user', res.data?.firstName)
          localStorage.setItem('lastLogin', res?.data?.lastLogin)

          if (res.data?.roleId === 1) {
            this.router.navigate(['/user/player'])
          }
          else if (res.data?.roleId === 2) {
            this.router.navigate(['/indexer'])
          }else if (res.data?.roleId === 4) {
            this.router.navigate(['/'])
          }else if (res.data?.roleId === 5) {
            this.router.navigate(['/streamer'])
          }

        } else {
          this.toastrService.error("Email or Password is incorrect!")
        }

      },
      error: (error) => {
        this.loading = false;
        if (error.status === 403 && error.error.message === 'Your account has been deactivated') {
          // Open the modal
          const activeModal =this.modalService.open(DeactiveUserModalComponent, {
          windowClass: "modal-md",
          backdrop: "static",
          keyboard: true,
          centered: true,
        })

        } else {
          // Handle other errors
          this.toastrService.error("Email or Password is incorrect!");
        }
      }

    })

    // this.authenticationService
    //   .login(this.f?.['username']?.value, this.f?.['password']?.value)
    //   .pipe(first())
    //   .subscribe({
    //     next: () => {
    //       this.router.navigate(['/dashboard/default']);
    //     },
    //     error: (error) => {
    //       this.error = error;
    //       this.loading = false;
    //     }
    //   });

  }

}
