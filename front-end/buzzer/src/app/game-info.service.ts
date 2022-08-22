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
  participantName = [];
  playerData = {} ;
  constructor() { }
}
