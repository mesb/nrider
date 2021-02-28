import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiderShellComponent } from './components/rider-shell/rider-shell.component';
import { MaterialModule } from '../material/material/material.module';

@NgModule({
	declarations: [
		RiderShellComponent
	],
	exports: [
		RiderShellComponent
	],
	imports: [
		CommonModule,
		MaterialModule
	]
})
export class CoreModule { }
