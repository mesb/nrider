import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { CoreModule } from '../core/core.module';
import { IndexComponent } from './components/index/index.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
	  IndexComponent, NotFoundComponent
  ],
  imports: [
    CommonModule,
	CoreModule,
	FormsModule,
	ReactiveFormsModule,
	MaterialModule,
    PagesRoutingModule
  ],
  exports: [
	  IndexComponent,
	  NotFoundComponent
  ]
})
export class PagesModule { }
