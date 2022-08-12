import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatFormField} from '@angular/material/form-field'
import { ApiService } from './api.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input'
import {FormsModule} from '@angular/forms';


import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { GameInfoService } from './game-info.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateTableComponent } from './create-table/create-table.component';
import { LoginComponent } from './login/login.component';
// import {MatButtonToggleModule} from '@angular/material'

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    ScoreBoardComponent,
    CreateTableComponent,
    LoginComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonToggleModule, //https://www.geeksforgeeks.org/how-to-create-mat-button-toggle-group-as-read-only-mode-in-angularjs/,
    RouterModule.forRoot([
      {
        path : '',
        component : LoginComponent
      },
      {
        path : 'createtable',
        component : CreateTableComponent
      },
      {
        path : 'table',
        component : QuestionComponent
      }
    ])
  ],
  providers: [GameInfoService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
