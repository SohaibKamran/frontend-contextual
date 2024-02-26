import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxDropdownConfig } from 'ngx-select-dropdown';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cdk-int-search',
  templateUrl: './int-search.component.html',
  styleUrls: ['./int-search.component.scss']
})
export class IntSearchComponent implements OnInit {

  @Input() data = [];
  @Output() selectControl: EventEmitter<any> = new EventEmitter();
  @Input() heading: string;
  // config :NgxDropdownConfig= {
  //   displayFn: (item: any) => { return item.first_name ? item.first_name + ' ' + item.last_name : item.name }, //to support flexible text displaying for each item
  //   displayKey: "first_name", //if objects array passed which key to be displayed defaults to description
  //   search: true, //true/false for the search functionlity defaults to false,
  //   height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
  //   placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
  //   limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
  //   moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
  //   noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
  //   searchPlaceholder: 'Search', // label thats displayed in search input,
  //   searchOnKey: undefined, // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  //   clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
  //   inputDirection: 'ltr' // the direction of the search input can be rtl or ltr(default)
  // }
  config :NgxDropdownConfig= {
    displayFn: (item: any) => { return item.first_name ? item.first_name + ' ' + item.last_name : item.name; },
    displayKey: "first_name",
    search: true,
    height: 'auto',
    placeholder: 'Select',


    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 0,
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    searchOnKey: undefined,
    clearOnSelection: false,
    inputDirection: 'ltr' // the direction of the search input can be rtl or ltr(default)
    ,
    customComparator: function (a: any, b: any): number {
      throw new Error('Function not implemented.');
    }
  }
  select(item) {
    this.selectControl.emit(item)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  ngOnInit(): void {
    this.config.placeholder = this.heading
    this.config.searchOnKey = this.data[0]?.name ? 'name' : undefined
  }

}
