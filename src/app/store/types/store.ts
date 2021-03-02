import { BehaviorSubject, Observable } from "rxjs";

// route types
export enum ROUTE_TYPE {
	LightRail,
	HeavyRail,
	CommuterRail,
	Bus,
	Ferry
}

// to string for ROUTE_TYPES
export function routeTypeName(id: ROUTE_TYPE): string {
	switch (id) {
		case ROUTE_TYPE.LightRail: return 'Light Rail'

		case ROUTE_TYPE.HeavyRail: return 'Heavy Rail'

		case ROUTE_TYPE.CommuterRail: return 'Commuter Rail'

		case ROUTE_TYPE.Bus: return 'Bus'

		case ROUTE_TYPE.Ferry: return 'Ferry'

		default: `No Such Route with ID, ${id}`;
	}
}

// key types
export enum KEY_TYPES {
	State,
	Error,
	Data,
	Options,
	Directions
}

// Action Types
export enum ACTION_TYPES {
	None,
	Store,
	Api,
	StorePut,
	StoreGet,
}

// type for actions
export type Action = {
	type: ACTION_TYPES,
	payload: any
}

// the selectors of the app for selecting user data
export enum SELECTOR_TYPE {
	ROUTE_IDS = "route_ids",
	ROUTES = 'routes',
	STOPS = 'stops',
	DIRECTIONS = 'directions',
	PREDICTIONS = 'predictions'
}

// the form controls names for the various selectors
export enum FORM_CONTROL_NAMES {
	ROUTE_ID = 'route_id',
	ROUTES = 'route',
	STOPS = 'stop',
	DIRECTIONS = 'direction'
}

export interface IAppBar {
	menuBtn: boolean;
	appTitle: string;
}

export interface ILeftNav {
	items: any[];
	opened: boolean;
	fixed: boolean;
}

export interface IStore {
	get(key: string): Observable<any>;
	put(key: string, payload: any): void;
}
