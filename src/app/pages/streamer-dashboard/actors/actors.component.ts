import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/api.service';
import { ToastrService } from 'ngx-toastr';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss']
})
export class ActorsComponent implements OnInit, OnDestroy {
  actors = [];
  showId;
  newActorName;
  newActorImageUrl;
  actorsPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 1000 }

  constructor(
    public modalService: NgbModal,
    public modal: NgbActiveModal,
    private apiService: ApiService,
    private toastr: ToastrService,
    ) {
    
  }
  ngOnInit(): void {
    this.showId = JSON.parse(sessionStorage.getItem('showId'))
    this.apiService.sendRequest(requests.getShowActors, 'post', { ...this.actorsPagination, showId: this.showId }).subscribe((res: any) => {
      if(res?.data?.rows)
        this.actors = res?.data?.rows;
    });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  removeActor(actorId) {
    this.apiService.sendRequest(requests.deleteActor, 'post', { actorId }).subscribe((res: any) => {
      if(res?.data > 0) {
        this.actors = this.actors.filter(actor => actor.id !== actorId);
        this.toastr.success('Actor removed successfully');
      }
    });
  }

  addActor() {
    const body = { 
      showId: this.showId, 
      name: this.newActorName, 
      imageUrl: this.newActorImageUrl ?? null
    }
    this.apiService.sendRequest(requests.addActor, 'post', body).subscribe((res: any) => {
      if(res?.data) {
        this.actors.push(res.data);
        this.toastr.success('Actor added successfully');
      }
    });
  }

  cancel() {
    this.modal.close('Close click')
  }

  done() {
    this.modal.close('Close click')
  }


}

