import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'protractor';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IStore, IAppBar } from './types/store';

export const MBTA_URL_BASE = `https://api-v3.mbta.com/`;

@Injectable({
	providedIn: 'root'
})
export class StoreService implements IStore {
	private data: Map<string, BehaviorSubject<any>>;
	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': `application/vnd.api+json`,
			// Authorization: 'my-auth-token'
		})
	}

	constructor(private http: HttpClient) {
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
		this.data.get(key).next(payload);
	}

	// fetch data for given path
	fetch(key: string, url?: string): Observable<any> {

		if (!!!url) {
			return this.get(key);
		}

		return this.http.get(`${MBTA_URL_BASE}${url}`)
			.pipe(
				tap(() => this.put(`${key}State`, 'loaded')),
				switchMap((result: any) => {
					this.put(key, result?.data);
					return this.get(key);
				}),
				catchError((error: Error) => {
					this.put(`${key}Error`, error);
					return of(null);
				})
			)
	}
}
