import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
	{
		path: 'index',
		component: IndexComponent
	},
	{
		path: '',
		redirectTo: 'index',
		pathMatch: 'full'
	},
	{
		path: '**',
		component: NotFoundComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
