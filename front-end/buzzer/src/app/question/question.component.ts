// import { GameInfoService } from './../game-info.service';
import { Component, OnInit } from '@angular/core';
import {GameInfoService} from '../game-info.service'
import { HttpClientModule } from '@angular/common/http';
import {ApiService} from '../api.service'
import {Components} from '../classes/question'


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  nextQuestion =[];
  clientQuestion =[];
  appData:any;
  timeLeft: number = 6;
  lockAnswer = false;
  private interval: number = 0;
  userName;
  showNextQuestionButton = false;
  DistableBuzzButton = false;
  answer = "";
  tableId= "";
  response = false;
  hostUser = ""
  showQuestion= false
  question = "";
  optionA = "";
  optionB = "";
  optionC = "";
  constructor(private gameInfo:GameInfoService, private api: ApiService) {
    this.userName = gameInfo.userName;
    this.tableId = gameInfo.tableTag;
    this.hostUser = gameInfo.hostUser;

    if(gameInfo.userName.localeCompare(gameInfo.hostUser) == 0 && gameInfo.hostUser.localeCompare("")!=0)
    {
      this.showNextQuestionButton = true;
    }
    else this.showNextQuestionButton = false;
    if (this.question.localeCompare("") == 0)
    {
      this.showQuestion = false;
      console.log("Is not empty",this.showQuestion);
    }
  }

  startTimer() {
    this.timeLeft = 60;
    setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      }
      else if(this.timeLeft === 0) {
        this.DistableBuzzButton = true;
        this.api.MakeQuestionasReadFromDatabase() //Not catching the first response.
        .subscribe
        (
          data => {
            if(!data){
              console.log("Problem reading database")
            }
          }
        );
        return;
      }
      else {
        this.timeLeft = 60;
      }
    },1000)    
  }
  startGame(){
    console.log(this.gameInfo.userName,this.gameInfo.hostUser);
    if (this.gameInfo.userName.localeCompare(this.gameInfo.hostUser)==0)
    {
      this.NextQuestion();
    }
    else{
      this.retriveScoreInterval();
    }
  }
  retriveScoreInterval() { //need to destroy the interval later
    console.log ("retriveScoreInterval is called")
    this.interval = 1000;
    var self = this
    var interval = setInterval(function(){
      self.api.FetchQuestionForJoinerFromDatabase() //Not catching the first response.
      .subscribe
      (
        data => {
          if(!data){
            console.log("Problem fetching from database")
          }
          else {
            self.showQuestion= true;
            self.clientQuestion=data;
            self.DistableBuzzButton = false;
            console.log(self.gameInfo.questionID, self.clientQuestion[0])
            // if(self.gameInfo.questionID==self.clientQuestion[0] && self.gameInfo.questionID!=0)
            // {
              // self.DistableBuzzButton = true;
            // }
            // else{
            //   self.DistableBuzzButton =true
            // }
            self.gameInfo.questionID = self.clientQuestion[0];
            self.question = self.clientQuestion[1];
            self.optionA = self.clientQuestion[2];
            self.optionB = self.clientQuestion[3];
            self.optionC = self.clientQuestion[4];

            // console.log(self.nextQuestion)
        }
        }
      );
      //code goes here that will be run every 5 seconds.
    }, self.interval);
  }
  NextQuestion()
  {
    this.showQuestion = true;
    this.api.GetNextQuestionFromDatabase() //Not catching the first response.
    .subscribe
    (
      data => {
        if(!data){
          console.log("Problem reading database")
        }
        this.nextQuestion=data;
        this.gameInfo.questionID = this.nextQuestion[0];
        this.question = this.nextQuestion[1];
        this.optionA = this.nextQuestion[2];
        this.optionB = this.nextQuestion[3];
        this.optionC = this.nextQuestion[4];
        this.startTimer();
      }
    );
    // this.appData= this.nextQuestion;
    this.DistableBuzzButton = false;
    console.log("We are here", this.nextQuestion)
    // console.log(this.nextQuestion.data)
    // for (const property in this.appData)
    // {
      // console.log(this.appData[ property])
    // }
  }

  toggleButtonResponse(value:any) {
    this.gameInfo.answer = value;
  }

  pressBuzzer(){
    if (this.gameInfo.answer.localeCompare("")==0){
      console.log("No answer is choosen")
    }

    else{
      this.api.CheckAnswerFromDatabase() //Not catching the first response.
    .subscribe
    (
      data => {
        this.response = data;
        console.log(this.response)
        }
    );
    this.DistableBuzzButton = true; //One time buzzer
    }
    
  }

  ngOnInit(): void {

  }

}