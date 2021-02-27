import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
	selector: 'app-rider-shell',
	templateUrl: './rider-shell.component.html',
	styleUrls: ['./rider-shell.component.scss']
})
export class RiderShellComponent implements OnInit {

	@Input() appBar: any = {
		menuBtn: true
	}
	@ContentChild('appBarTemplate') appBarTemplateRef: TemplateRef<any>;

	@Input() leftNav: any = {
		opened: false
	}

	@ContentChild('leftNavTemplate') leftNavTemplateRef: TemplateRef<any>;

	@Input() page: any;
	@Input('pageTemplate') pageTemplateRef: TemplateRef<any>;

	ngOnInit(): void {
	}

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(private breakpointObserver: BreakpointObserver) { }

}
