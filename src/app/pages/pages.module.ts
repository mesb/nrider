import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { CoreModule } from '../core/core.module';
import { IndexComponent } from './components/index/index.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


@NgModule({
  declarations: [
	  IndexComponent, NotFoundComponent
  ],
  imports: [
    CommonModule,
	CoreModule,
    PagesRoutingModule
  ],
  exports: [
	  IndexComponent,
	  NotFoundComponent
  ]
})
export class PagesModule { }
