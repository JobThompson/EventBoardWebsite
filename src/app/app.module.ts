import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BoardCreateComponent } from './components/board-create/board-create.component';
import { BoardViewComponent } from './components/board-view/board-view.component';
import { BoardEditComponent } from './components/board-edit/board-edit.component';
import { MessageCreateComponent } from './components/message-create/message-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BoardCreateComponent,
    BoardViewComponent,
    BoardEditComponent,
    MessageCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
