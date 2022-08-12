import { Component, OnInit } from '@angular/core';
import {GameInfoService} from '../game-info.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit {
  playerInTable = 3;
  playerName;
  rowName = ["Tag", "Active Question", "Score"];
  playerData;
  playerScore;
  playerCurrentScore;
  boxColor;
  typeOf = typeof (this.rowName[0]);
  interval = 10000;
  scoreResponse = [];

  constructor(gameInfo : GameInfoService,private api: ApiService) { 
    this.playerScore = [];
    this.playerCurrentScore = [];
    this.boxColor = [];
    // this.playerName = gameInfor.participantName;
    this.playerData = gameInfo.playerData;
    this.playerName = Object.keys(this.playerData);
    for (let i = 0; i< this.playerName.length; i++){
      this.playerScore.push(this.playerData[this.playerName[i] as (keyof typeof this.playerData)][0]);
      this.playerCurrentScore.push(this.playerData[this.playerName[i] as (keyof typeof this.playerData)][1]);      
      // this.playerScore.push(['3']);
    }

    for (let i = 0 ; i< this.playerCurrentScore.length; i++){
      if (this.playerCurrentScore[i]==0)
      {
        this.boxColor.push('red');
      }
      else {
        this.boxColor.push('green');
      }
    }
    this.retriveScore()
  }

  retriveScore() { //need to destroy the interval later
    this.interval = 8000;
    var self = this
    var interval = setInterval(function(){
          self.api.GetQuestionWinneFromDatabase()
          .subscribe
          (
            data => {
              self.scoreResponse = data;
              console.log("winner of recent question is:");
              console.log(self.scoreResponse)
            }
          );

      self.api.GetScoreFromDatabase()
      .subscribe
      (
        data => {
          self.scoreResponse = data;
          self.playerName=[]
          self.playerScore=[]
          
          for ( let tag in self.scoreResponse)
          {
            self.playerName.push(self.scoreResponse[tag][0])
            self.playerScore.push(self.scoreResponse[tag][2])
            // console.log(self.scoreResponse[tag][2])
          }
          console.log(self.scoreResponse)
          
                }
            
          
      );
      //code goes here that will be run every 5 seconds.
    }, self.interval);
  }
  ngOnInit(): void {
  }
}