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
  recentWinner = "";

  constructor(gameInfo : GameInfoService,private api: ApiService) { 
    this.playerScore = [0];
    this.playerCurrentScore = [0];
    this.boxColor = [];
    // this.playerName = gameInfor.participantName;
    this.playerData = gameInfo.playerData;
    this.playerName = Object.keys(this.playerData);
    // for (let i = 0; i< this.playerName.length; i++){
    //   this.playerScore.push(this.playerData[this.playerName[i] as (keyof typeof this.playerData)][0]);
    //   this.playerCurrentScore.push(this.playerData[this.playerName[i] as (keyof typeof this.playerData)][1]);      
    //   // this.playerScore.push(['3']);
    // }

    for (let i = 0 ; i< this.playerCurrentScore.length; i++){
      if (this.playerCurrentScore[i]==0)
      {
        this.boxColor.push('red');
      }
      else {
        this.boxColor.push('green');
      }
    }
    this.fetchScoreinIntervals()
  }

  fetchScoreinIntervals() { //need to destroy the interval later
    this.interval = 4000;
    var self = this;

    //Check score after some interval and update parameter

    var interval = setInterval(function(){
      console.log("We are fetching score.");

      self.api.GetScoreFromDatabase()
      .subscribe
      (
        data => {
          self.scoreResponse = data;

          self.playerName= [];
          self.playerScore= [];

          for ( let tag in self.scoreResponse)
          {
            self.playerName.push(self.scoreResponse[tag][0]);
            self.playerScore.push(self.scoreResponse[tag][2]);
            // console.log(self.scoreResponse[tag][2])
          }
          console.log(self.scoreResponse);
                }
      );

      // Get score of recent open question

      self.api.GetQuestionWinneFromDatabase()
      .subscribe
      (
        data => {
          self.recentWinner = data;
          if (self.recentWinner[0]){
            // console.log("winner of recent question is:");
            // console.log(self.recentWinner[0], self.playerName.length);
            self.playerCurrentScore = [];
            for ( let player = 0; player <= self.playerName.length; player++)
            {
              // console.log("Player : "+ self.playerName + self.playerName[player])
              // console.log(" =Winner: " + self.recentWinner[0])
              if (self.playerName[player].localeCompare(self.recentWinner[0])==0)
                {
                  // console.log("We got a winner")
                  self.playerCurrentScore.push(1);
                }
                else
                {
                  // console.log("We do not get a winner")
                  self.playerCurrentScore.push(0);
                }
            }
          }
          else
          {
            for ( let player in self.playerData)
            {
              // self.playerData[player][0]=0;
              
            }
          }
        }
      );


      //code goes here that will be run every 5 seconds.
    }, self.interval);
  }
  ngOnInit(): void {
  }
}