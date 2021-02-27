import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(public store: StoreService) { }

  ngOnInit(): void {
	  console.log('the store data is: ', this.store)
	//   this.store.putData('appBar', {title: 'WMWA RIDER', menuBtn: false})
  }

}
