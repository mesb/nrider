import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnDestroy, OnInit, SkipSelf, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, filter, map, mapTo, skip, startWith, switchMap, take, tap } from 'rxjs/operators';
import { StoreService } from 'src/app/store/store.service';
import { ACTION_TYPES, FORM_CONTROL_NAMES, KEY_TYPES, routeTypeName, ROUTE_TYPE, SELECTOR_TYPE } from 'src/app/store/types/store';
import { FIELD_TYPES } from 'src/app/store/types/forms';
import { type } from 'os';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { element } from 'protractor';
import { start } from 'repl';

// data for constructing selector objects
const fieldsConfig = [
	{
		key: SELECTOR_TYPE.ROUTE_IDS,
		type: FIELD_TYPES.Chips,
		prompt: 'Select Route Types',
		fcn: FORM_CONTROL_NAMES.ROUTE_ID,
		query: `routes?sort=type&filter[type]=`,
		selected: '',
		next: SELECTOR_TYPE.ROUTES,
		requiredFields: ['long_name', 'id', 'type', 'direction_destinations', 'direction_names'],
		titleField: 'long_name'
	},
	{
		key: SELECTOR_TYPE.ROUTES,
		type: FIELD_TYPES.Select,
		prompt: 'Select Route',
		fcn: FORM_CONTROL_NAMES.ROUTES,
		// ops: [{
		// 	type: ACTION_TYPES.Api, payload: `stops?filter[route]=`
		// }],
		query: `stops?filter[route]=`,
		selected: '',
		next: SELECTOR_TYPE.STOPS,
		requiredFields: ['name'],
		titleField: 'name'
	},
	{
		type: FIELD_TYPES.Select,
		key: SELECTOR_TYPE.STOPS,
		fcn: FORM_CONTROL_NAMES.STOPS,
		name: 'name',
		prompt: 'Select Stop',
		// ops: [{
		// 	type: ACTION_TYPES.None, payload: {
		// 		op: ACTION_TYPES.StorePut,
		// 	}
		// }],
		query: `stops?filter[route]=`,
		selected: '',
		next: SELECTOR_TYPE.DIRECTIONS,
		requiredFields: ['name'],
		titleField: 'name'
	},
	{
		type: FIELD_TYPES.Select,
		key: SELECTOR_TYPE.DIRECTIONS,
		fcn: FORM_CONTROL_NAMES.DIRECTIONS,
		prompt: 'Select Direction',
		name: 'name',
		ops: [{ type: ACTION_TYPES.None }],
		query: `predictions?`,
		selected: '',
		next: SELECTOR_TYPE.PREDICTIONS,
		requiredFields: ['arrival_time', 'departure_time', 'id'],
		titleField: 'departure_time',
	},
	{
		type: FIELD_TYPES.View,
		key: SELECTOR_TYPE.PREDICTIONS,
		fcn: null,
		prompt: '',
		name: 'name',
		ops: [{ type: ACTION_TYPES.None }],
		query: ``,
		selected: '',
		next: null,
		requiredFields: ['arrival_time', 'departure_time', 'direction_id'],
		titleField: 'departure_time',
		show: false,
	}
]

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})


export class IndexComponent implements OnInit, OnDestroy {
	// the list of form fields
	FORM_FIELDS = FIELD_TYPES;
	// the form that helps a user select a train
	trainForm: FormGroup = this.fb.group({
		route_id: [''],
		route: ['', [Validators.required]],
		stop: ['', [Validators.required]],
		direction: ['', [Validators.required]]
	})

	// acquire the list of route types
	routeTypes$ = this.store.get(this.store.makeTypeKey(SELECTOR_TYPE.ROUTE_IDS, KEY_TYPES.Options));

	// keep track of the directions for the selected route
	selectedRouteDirections$: BehaviorSubject<any> = new BehaviorSubject([]);

	// singal to get the route directions
	getDirectionsForRoute$ = new Subject();

	// stream for capturing predictions
	// since we need just the next predicted time, we only need the first element of the sorted list
	predictions$ = this.store.get(this.store.makeTypeKey(SELECTOR_TYPE.PREDICTIONS, KEY_TYPES.Options)).pipe(
		filter(preds => !!preds),
		map(preds => [preds[0]]),
	)

	// init selectors
	selectors = [];

	constructor(public store: StoreService, private fb: FormBuilder) {

		// get the directions for the given route and send to the selectedRouteDirections$ stream
		this.getDirectionsForRoute$.pipe(
			switchMap(id => this.store.get(this.store.makeTypeKey(SELECTOR_TYPE.ROUTES, KEY_TYPES.Options))
				.pipe(
					filter(dat => !!dat),
					map(dat => dat.filter((d: any) => d.id === id).map((obj: any) => ({ dest: obj.direction_destinations, names: obj.direction_names }))),
					map((dataList: any[]) => dataList[0]),
					map((dPkg: { dest: string[], names: string[] }) => dPkg.dest.map((item: any, i: number) => (
						{
							id: dPkg.names[i],
							title: `${dPkg.names[i]} :: ${dPkg.dest[i]}`,
							name: dPkg.dest[i],
							destination: dPkg.names[i]
						}
					)))
				))
		).subscribe(directions => {
			this.selectedRouteDirections$.next(directions);
		})
	}


	ngOnInit(): void {
		// initialize selectors
		this.selectors = fieldsConfig.map(obj => {

			return {
				...obj,
				options$: this.store.get(this.store.makeTypeKey(obj.key, KEY_TYPES.Options))
			}
		});

		// initialize view with routes for light and heavy rail
		of(this.selectors).pipe(
			filter(selectors => !!selectors),
			map((selectors: any[]) => selectors.find(sel => sel.key === SELECTOR_TYPE.ROUTE_IDS))
		).subscribe((sel: any) => {
			this.handleSelection(`${ROUTE_TYPE.LightRail},${ROUTE_TYPE.HeavyRail}`, sel);
			this.store.put(
				this.store.makeTypeKey(SELECTOR_TYPE.ROUTE_IDS, KEY_TYPES.Options),
				Object.keys(ROUTE_TYPE).filter(key => key.length === 1)
					.map((key: string) => {
						const lr = ROUTE_TYPE[ROUTE_TYPE.LightRail];
						const hr = ROUTE_TYPE[ROUTE_TYPE.HeavyRail];

						let chipTemplate = { selected: false, selectable: false, name: ROUTE_TYPE[key] };

						if (ROUTE_TYPE[key] === lr || ROUTE_TYPE[key] === hr) {
							return { ...chipTemplate, selected: true };
						}

						return chipTemplate;

					})
			);
		})
	}

	handleSelection(payload: any, selector: any) {
		// clear the next chain of selectors and reset options
		this.clearNextChain(selector);

		switch (selector.key) {
			// get the directions for the selected route and deliver the stops for that route
			case SELECTOR_TYPE.ROUTE_IDS: {
				// this.getDirectionsForRoute$.next(payload)
				this.store.deliver(selector.next, `${selector.query}${payload}`, selector.requiredFields, selector.titleField, KEY_TYPES.Options)
				break;
			}

			case SELECTOR_TYPE.ROUTES: {
				this.getDirectionsForRoute$.next(payload)
				this.store.deliver(selector.next, `${selector.query}${payload}`, selector.requiredFields, selector.titleField, KEY_TYPES.Options)
				break;
			}

			// prepare the directions for the given route
			case SELECTOR_TYPE.STOPS: {
				this.store.put(this.store.makeTypeKey(selector.next, KEY_TYPES.Options), [...this.selectedRouteDirections$.getValue()])
				break;
			}

			// get the prediction for the route, stop and direction
			// use the info in the trainForm(route, stop and direction) to deliver the next prediction
			case SELECTOR_TYPE.DIRECTIONS: {
				const pkg = { ...this.trainForm.value }
				const pred = this.selectors.find(s => s.key === SELECTOR_TYPE.PREDICTIONS);
				this.store.deliver(
					pred.key,
					`${selector.query}filter[direction_id]=${pkg.direction}&filter[stop]=${pkg.stop}&filter[route]=${pkg.route}`,
					pred.requiredFields, pred.titleField, KEY_TYPES.Options
				);
				this.store.put(this.store.makeTypeKey(SELECTOR_TYPE.PREDICTIONS, KEY_TYPES.Options), []);

				break;
			}

			default:
				throw new Error('Unrecognized selector')
		}

	}

	clearNextChain(selector: any) {
		if (!!!selector || !!!selector.next) {
			return;
		}

		this.store.put(this.store.makeTypeKey(selector.next, KEY_TYPES.Options), []);

		this.resetFormControl(selector.next, this.trainForm);
		this.clearNextChain(this.selectors.find(sel => sel.key === selector.next));
	}

	resetFormControl(fieldKey: string, formGroup: FormGroup) {
		if (!(fieldKey && formGroup)) {
			return;
		}

		const selector = this.selectors.find(sel => sel.key === fieldKey);

		if (!!!selector) {
			return;
		}

		const ctrl = formGroup.controls[selector.fcn];

		if (!ctrl) {
			return;
		}

		ctrl.reset();
		ctrl.setErrors(null);
		ctrl.setValue('');

	}

	toggleRouteType(routeType, routeTypes) {

		if (!routeType.selectable) {
			return;
		}

		const nextRoutes = routeTypes.map(rt => rt.name === routeType.name ? { ...routeType, selected: !routeType.selected } : rt);
		this.store.put(this.store.makeTypeKey(SELECTOR_TYPE.ROUTE_IDS, KEY_TYPES.Options), nextRoutes);
	}

	ngOnDestroy(): void {
	}

}
