import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { StoreService } from '../store/store.service';
import { IAppBar, ILeftNav } from '../types/store';

@Component({
	selector: 'app-rider-shell',
	templateUrl: './rider-shell.component.html',
	styleUrls: ['./rider-shell.component.scss']
})
export class RiderShellComponent implements OnInit, OnDestroy {

	@Input() appBar: IAppBar;
	subs: Subscription = new Subscription();
	@ContentChild('appBarTemplate') appBarTemplateRef: TemplateRef<any>;

	@Input() leftNav: ILeftNav;
	@ContentChild('leftNavTemplate') leftNavTemplateRef: TemplateRef<any>;

	@Input() page: any;
	@Input('pageTemplate') pageTemplateRef: TemplateRef<any>;

	ngOnInit(): void {
		// initialize store fields
		this.store.put('appBar', { appTitle: `WMATA TITLE`, menuBtn: false });
		this.store.put('leftNav', {
			opened: false, items: [
				{
					url: '/link1',
					title: 'Link 1',
					icon: ''
				},
				{
					url: '/link2',
					title: 'Link 2',
					icon: ''
				},
				{
					url: '/link3',
					title: 'Link 3',
					icon: ''
				},
				{
					url: '/link4',
					title: 'Link 4',
					icon: ''
				},

			]
		});

		// subscribe to the stream of appBar data packets
		this.subs.add(this.store.get('appBar').subscribe(d => {
			this.appBar = { ...d }
		}));

		// subscribe to the stream of leftNav data packets
		this.subs.add(this.store.get('leftNav').subscribe(data => {
			this.leftNav = { ...data }
		}));
	}

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(private breakpointObserver: BreakpointObserver, private store: StoreService) { }

	menuBtnClicked() {
		this.store.put('leftNav', { ...this.leftNav, opened: !this.leftNav.opened });
	}

	ngOnDestroy(): void {
		// ubsubscribe from all subscriptions under subs
		this.subs.unsubscribe();
	}



}
