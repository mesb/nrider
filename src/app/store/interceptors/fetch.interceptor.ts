import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class FetchInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

	const jsonApiReq = request.clone({
		setHeaders: {
			// 'Content-Type': 'application/vnd.api+json',
			// Authorization: `${environment.mbtaKey}`
		}
	});
    return next.handle(jsonApiReq);
  }
}
