import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FetchInterceptor } from './interceptors/fetch.interceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
	  {provide: HTTP_INTERCEPTORS, useClass: FetchInterceptor, multi: true}
  ]
})
export class StoreModule { }
