import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BoardCreateComponent } from './components/board-create/board-create.component';
import { BoardViewComponent } from './components/board-view/board-view.component';
import { BoardEditComponent } from './components/board-edit/board-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: BoardCreateComponent },
  { path: 'board/:id', component: BoardViewComponent },
  { path: 'board/:id/edit', component: BoardEditComponent },
  { path: 'share/:shareLink', component: BoardViewComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
