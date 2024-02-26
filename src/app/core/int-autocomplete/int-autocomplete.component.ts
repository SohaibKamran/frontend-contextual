import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'cdk-int-autocomplete',
  templateUrl: './int-autocomplete.component.html',
  styleUrls: ['./int-autocomplete.component.scss']
})
export class IntAutocompleteComponent implements OnInit {
  @Input() data: []
  @Input() keyword: string;
  @Output() changeInput: EventEmitter<any> = new EventEmitter()
  @Output() selectMovie: EventEmitter<any> = new EventEmitter()
  @ViewChild('auto') auto;

  constructor() { }

  ngOnInit(): void {
  }
  selectEvent(item) {
    this.selectMovie.emit(item)
  }
  inputCleared(value:any)
  {
    // value=null
    this.auto.close()
  }
  onChangeSearch(value: string) {
    // console.log('value chaning here',value);
    if(value)
    {
      value=''
    }
    this.changeInput.emit(value)
  }
}
