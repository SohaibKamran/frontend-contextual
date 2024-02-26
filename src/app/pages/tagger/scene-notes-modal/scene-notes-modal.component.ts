import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-scene-notes-modal',
  templateUrl: './scene-notes-modal.component.html',
  styleUrls: ['./scene-notes-modal.component.scss']
})
export class SceneNotesModalComponent implements OnInit {

  @Input() sceneId;
  @Input() editOrNew='edit';
  staticData: any = []

  constructor(
    public modalService: NgbModal,
    public apiService: ApiService,
    public toastr: ToastrService
  ){

  }
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const formattedDate = new Date(dateString).toLocaleString('en-US', options);
    return formattedDate;
  }
  ngOnInit(): void {
    this.staticData = [];
    if(this.editOrNew != 'edit')
    {
      this.addRow()
    }
    this.apiService.sendRequest(requests.getSceneNotes,'post',{sceneId:this.sceneId}).subscribe((data:any)=>{
      let allRecords = data.data;
      for(let x in allRecords)
      {
        let obj = {
          header: "FROM "+ this.formatDate(allRecords[x].updatedAt),
          description: allRecords[x].note,
          checked: allRecords[x].isCompleted,
          id: allRecords[x]?.id 
        }
        this.staticData.push(obj)
      }
    })
  }
  updateSceneToDo() {
    let notes = []
    for (let data of this.staticData) {
      if(data.hasOwnProperty('id')) {
        let obj = {
          id: data.id,
          isCompleted: data.checked?true:false
        }
        notes.push(obj)
      }
    }
      this.apiService.sendRequest(requests.updateSceneNotes, 'post', {
        notes
      }).subscribe(response => {
        this.toastr.success('Notes Updated')
      });
    
  }
  addSceneToDo()
  {
    let body= {
      limit: 10,
      pageNo: 1,
      sceneId: this.sceneId
    }
    this.apiService.sendRequest(requests.getSceneCooerdinates, 'post', body).subscribe((res: any) => {
      let from_userId = localStorage.getItem('userId');
      // let to_userId = res?.data?.rows[0]?.Tagger?.id
      let bodyForAddSceneNote = {
        sceneId: this.sceneId,
        assignedFrom: from_userId,
        assignedTo: from_userId, // feature not implemented, so assigning to self
        note: this.staticData[0].description
      }
      this.apiService.sendRequest(requests.addSceneNotes,'post',bodyForAddSceneNote).subscribe((res:any)=>{
        this.toastr.success('Note Added')
        this.ngOnInit();
      });
    });
  }
  addRow() {
    let obj = {
      header : "FROM " + this.formatDate(new Date().toISOString()),
      description : '',
      checked : false
    }
    this.staticData.push(obj)
  }

  deleteNote(data) {
    this.apiService.sendRequest(requests.deleteSceneNotes,'post',{id: data.id}).subscribe((res:any)=>{
      this.toastr.success('Note Deleted')
      this.ngOnInit();
  });
  }
}
