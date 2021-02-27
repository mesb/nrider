import { BehaviorSubject, Observable } from "rxjs";

export type NRIDER_STATE = 'loading' | 'error' | 'loaded' | Observable<'loading' | 'error' | 'loaded'>;

export interface IAppBar {
	menuBtn: boolean;
	appTitle: string;
}

export type NRIDER_TYPE = IAppBar | Observable<IAppBar> | NRIDER_STATE | Observable<NRIDER_STATE> | Error | Observable<Error>;

export interface IStore {
	// data: Map<string, NRIDER_TYPE>;
	// errors: Map<string, Error>;
	// state: Map<string, NRIDER_STATE;
	// getError(key: string): Error | BehaviorSubject<Error>;
	// getData(key: string): NRIDER_TYPE | BehaviorSubject<NRIDER_TYPE>;
	// getState(key: string): NRIDER_STATE | BehaviorSubject<NRIDER_STATE>;
	get(key: string): Observable<any>;

	// setters
	// putError(key: string, error: Error);
	// putData(key: string, data: NRIDER_TYPE);
	// putState(key: string, state: NRIDER_STATE);
	put(key: string, payload: any): void;
}
