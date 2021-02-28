import { BehaviorSubject, Observable } from "rxjs";

// route types
export enum ROUTE_TYPE {
	LightRail,
	HeavyRail,
	CommuterRail,
	Bus,
	Ferry
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
