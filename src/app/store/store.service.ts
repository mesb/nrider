import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'protractor';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, map, mergeMap, skip, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IStore, IAppBar, KEY_TYPES, Action } from './types/store';

export const MBTA_URL_BASE = `https://api-v3.mbta.com/`;

@Injectable({
	providedIn: 'root'
})
export class StoreService implements IStore {
	private data: Map<string, BehaviorSubject<any>>;
	private delivered$: Subject<{ key: string; data: any }> = new Subject();
	private deliveryError$: Subject<{ key: string; error: Error }> = new Subject();
	private deliver$: Subject<{ key: string; url?: string, requiredFields?: string[], titleField?: string; keyType?: KEY_TYPES }> = new Subject();
	public eval$: Subject<Action> = new Subject();

	constructor(private http: HttpClient) {
		this.data = new Map();

		// handle the stream of requests to fetch data
		// if successful, send to the dataFetched$ stream
		// if error, add to the fetchError$ stream
		this.deliver$.pipe(
			mergeMap((pkg: any) => this.http.get(`${MBTA_URL_BASE}${pkg.url}`).pipe(
				tap(() => this.put(this.makeTypeKey(pkg.key, KEY_TYPES.State), 'loaded')),
				map((result: any) => ({ key: pkg.key, data: result?.data, requiredFields: pkg.requiredFields, titleField: pkg.titleField, keyType: pkg.keyType })),
				catchError((error: Error) => {
					// this.put(this.makeTypeKey(pkg.key, KEY_TYPES.Error), error);
					this.deliveryError$.next({ key: pkg.key, error });
					return of({ key: pkg.key, data: null });
				})
			))
		).subscribe(data => {
			this.delivered$.next(data);
		})

		// tap into stream of fetched data and update store
		this.delivered$
			.pipe(
				map((pkg: any) => {
					if (!!!pkg.requiredFields) {
						return pkg;
					}
					return {
						...pkg,
						data: pkg.data.map((data: any) => pkg.requiredFields.reduce((acc: any, key: string) => {
							if (!acc['id']) {
								acc['id'] = data.id;
							}

							if (!!pkg.titleField) {
								acc['title'] = data.attributes[pkg.titleField];
							}

							acc[key] = data.attributes[key];
							return acc;
						}, {}))
					};
				})
			)
			.subscribe(pkg => {
				const key = !!pkg.keyType ? this.makeTypeKey(pkg.key, pkg.keyType) : pkg.key;
				this.put(key, pkg.data)
			})
	}

	// initialize storage space for a given key
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
		this.data.get(key).next(payload);
	}

	// fetch data for given path
	deliver(key: string, url?: string, requiredFields?: string[], titleField?: string, keyType?: KEY_TYPES) {
		this.initKey(key);
		this.deliver$.next({ key, url, requiredFields, titleField, keyType });
	}

	// make state key for a given key
	public makeTypeKey(key: string, keyType: KEY_TYPES): string {
		return `${key}${keyType}`
	}
}
