import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameInfoService {
  userName = "islam";
  hostUser = "";
  tableTag = "";
  questionID = 0;
  question = "";
  optionA = "";
  optionB = "";
  optionC = "";
  answer = "";
  isScoreboardPage = false;
  lastQuestionWinner = ""
  participantName = ["Shaolin", "Shafiqul", "Islam"];
  playerData = {'Shaolin':[2,1],'Shafiqul':[1,0],'Islam':[4,0]} ;
  constructor() { }
}
