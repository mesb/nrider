import { BehaviorSubject, Observable } from "rxjs";

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
