// Angular import
import { BootstrapOptions, Component, EventEmitter, Output } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
// import * as bootstrap from "bootstrap"
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // public props
  @Output() NavCollapsedMob = new EventEmitter();
  @Output() SubmenuCollapse = new EventEmitter();
  @Output() NavCollapse = new EventEmitter();
  navCollapsedMob;
  windowWidth: number;
  subMenuCollapsed: boolean;
  themeLayout: string;
  navbarCollapse:boolean=false
  // Constructor
  constructor(private sharedService:SharedService) {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;

  }

  ngOnInit(){
    this.sharedService.navbar.subscribe((res)=>{
      if(res!=this.navbarCollapse){
        this.navbarCollapse=res
        this.navCollapse()
      }
      console.log(res, 'Navigation')
    })
  }

  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  // closeSidebar() {
    // const offcanvas = document.getElementById('offcanvasExample')
    // offcanvas[0].style.display='none'
    // const elem = document.getElementsByClassName('show')
    // console.log(elem)
    // elem[1]['style'].opacity = "0"
    // let bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    // console
    // bsOffcanvas.hide();
  // }

  navSubmenuCollapse() {
    this.SubmenuCollapse.emit();
  }

  navCollapse() {
    this.NavCollapse.emit();
  }
}
