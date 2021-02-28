import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StoreService } from 'src/app/store/store.service';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

	routes = [];
	routesError = '';
	routesLoader = '';
	subs = new Subscription();

	constructor(public store: StoreService) { }

	ngOnInit(): void {
		this.store.put('routesStates', 'loading');


		console.log('the store data is: ', this.store)
		//   this.store.putData('appBar', {title: 'WMWA RIDER', menuBtn: false})

		this.subs.add(this.store.fetch('routes/0', `https://api-v3.mbta.com/routes`).subscribe(data => {
			this.routes = {...data};
		}));

		this.subs.add(this.store.get('routesError').pipe(filter(err => !!err)).subscribe((error: Error) => {
			this.routesError = error.message;
		}))

		this.subs.add(this.store.get('routesState').pipe(filter(err => !!err)).subscribe((state: any) => {
			this.routesLoader = state;
		}))

	}

	ngOnDestroy(): void {
		this.subs.unsubscribe
	}

}
