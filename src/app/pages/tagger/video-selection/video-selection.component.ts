import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { TaggerService } from '../tagger.service';

@Component({
  selector: 'app-video-selection',
  templateUrl: './video-selection.component.html',
  styleUrls: ['./video-selection.component.scss']
})
export class VideoSelectionComponent implements OnInit {

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private taggerService: TaggerService,
    private loader: NgxSpinnerService,
    // private toastr: ToastrService,
  ) { }

  dumyVar: string;
  allVideos: any = [];

  goToTagger(id: any) {
    sessionStorage.setItem('showId', id)
    this.router.navigate(['/tagger/tag-video'])
  }

  ngOnInit(): void {
    if (this.router.url == '/tagger/video') {
      this.sharedService.showToolbar = true;
    }
    this.loader.show()
    this.taggerService.getAllShows().subscribe(data => {
      // // console.log(data);
      this.allVideos = data['data'].rows;
      this.allVideos = this.allVideos.filter((element: any) =>
        element.id != null
      )
      this.loader.hide()
    },
      (err) => {
        this.loader.hide()
        // this.toastr.error(err?.error?.message, "Error")
      }
    )
  }

}
