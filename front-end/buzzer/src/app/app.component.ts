import { Component, OnInit } from '@angular/core';
import { GameInfoService } from './game-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bazzer';
  user:string;
  constructor(private gameInfo:GameInfoService) { 
  }
  OnInit(){
    this.user= this.gameInfo.userName;
  }
}
