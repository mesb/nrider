import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStore, IAppBar, NRIDER_STATE, NRIDER_TYPE } from '../types/store';

@Injectable({
	providedIn: 'root'
})
export class StoreService implements IStore {
	private data: Map<string, BehaviorSubject<any>>;

	constructor() {
		this.data = new Map();
	}

	private initKey(key: string) {
		const obs = this.data.get(key);

		if (!!!obs) {
			this.data.set(key, new BehaviorSubject(null));
		}
	}

	// get item from the store for given key
	get(key: string): Observable<any> {
		this.initKey(key);
		return this.data.get(key);
	}

	// put item in store for given key
	put(key: string, payload: any) {
		this.initKey(key);
		this.data.get(key).next(payload) ;


	}
}
