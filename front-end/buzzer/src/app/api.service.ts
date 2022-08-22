import { GameInfoService } from './game-info.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


export interface Config {
  heroesUrl: string;
  textfile: string;
  date: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = "http://172.16.224.199:5000"
  configUrlCreateTable = this.url + '/CreatePalyingTable?user=xxxx';
  configUrlGetScore = this.url + '/CheckScore?hostUser=xxxx&tableTag=xxxx';
  configUrlCheckAnswer = this.url + '/CheckAnswer?user=xxxx&hostUser=xxxx&tableTag=xxxx&questionID=xxxx&answer=xxxx';
  configUrlRequestForQuestion = this.url + '/RequestForQuestion?hostUser=xxxx&tableTag=xxxx';
  configUrlRequestForUpdateQuestionStatus = this.url + '/MakeQuestionasRead?hostUser=xxxx&tableTag=xxxx';
  configUrlRequestForQuestionForJoiner = this.url + '/FetchQuestionForJoinerFromDatabase?hostUser=xxxx&tableTag=xxxx';
  configUrlJoinInaExistingTable = this.url + '/JoinInaExistingTable?user=xxxx&hostUser=xxxx&table_tag=xxxx';
  configUrlCheckHost = this.url + '/CheckHost?tableTag=xxxx';
  configUrlGetQuestionWinner = this.url + '/CheckRecentQuestionResult?hostUser=xxxx&tableTag=xxxx';

  constructor(private http: HttpClient, private gameInfoService: GameInfoService) {
   }
   CheckAnswerFromDatabase(): Observable<any> 
   {
     const httpOptions = {
       headers: new HttpHeaders({
         'Access-Control-Allow-Origin':'*',
         'Access-Control-Allow-Methods':'GET,POST',
         'Access-Control-Allow-Headers':'*'
                               })
                         }
     let user = this.gameInfoService.userName;
     let hostUser = this.gameInfoService.hostUser;
     let tableTag = this.gameInfoService.tableTag;
     let questionID = this.gameInfoService.questionID;
     let answer = this.gameInfoService.answer;
     let urlPreparation = this.configUrlCheckAnswer.replace('user=xxxx','user='+ user);
     urlPreparation = urlPreparation.replace("hostUser=xxxx", "hostUser="+ hostUser);
     urlPreparation = urlPreparation.replace("tableTag=xxxx", "tableTag="+ tableTag);
     urlPreparation = urlPreparation.replace("questionID=xxxx", "questionID="+ questionID);
     urlPreparation = urlPreparation.replace("answer=xxxx", "answer="+ answer);
     let request = this.http.get(urlPreparation, httpOptions);
     return request;
   }



   CreateTable(): Observable<any> 
   {
     const httpOptions = {
       headers: new HttpHeaders({
         'Access-Control-Allow-Origin':'*',
         'Access-Control-Allow-Methods':'GET,POST',
         'Access-Control-Allow-Headers':'*'
                               })
                         }
     let user= this.gameInfoService.userName;
     let request = this.http.get(this.configUrlCreateTable.replace('user=xxxx','user='+ user), httpOptions);

    //  let tableTag = this.gameInfoService.tableTag;
    //  let request = this.http.get(this.configUrlCheckHost.replace('tableTag=xxxx','tableTag='+ tableTag), httpOptions);
     // console.log(request)
     return request;
   }

   MakeQuestionasReadFromDatabase(): Observable<any> 
   {
     const httpOptions = {
       headers: new HttpHeaders({
         'Access-Control-Allow-Origin':'*',
         'Access-Control-Allow-Methods':'GET,POST',
         'Access-Control-Allow-Headers':'*'
                               })
                         }
     let hostUser = this.gameInfoService.hostUser;
     let tableTag = this.gameInfoService.tableTag;
     let urlPreparation = this.configUrlRequestForUpdateQuestionStatus.replace('hostUser=xxxx','hostUser='+ hostUser);
     urlPreparation = urlPreparation.replace("tableTag=xxxx", "tableTag="+ tableTag);
     let request = this.http.get(urlPreparation, httpOptions);
     return request;
   }

  GetNextQuestionFromDatabase(): Observable<any> 
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Access-Control-Allow-Headers':'*'
                              })
                        }
    let hostUser = this.gameInfoService.hostUser;
    let tableTag = this.gameInfoService.tableTag;
    let urlPreparation = this.configUrlRequestForQuestion.replace('hostUser=xxxx','hostUser='+ hostUser);
    urlPreparation = urlPreparation.replace("tableTag=xxxx", "tableTag="+ tableTag);
    let request = this.http.get(urlPreparation, httpOptions);
    return request;
  }

  FetchQuestionForJoinerFromDatabase(): Observable<any> 
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Access-Control-Allow-Headers':'*'
                              })
                        }
    let hostUser = this.gameInfoService.hostUser;
    let tableTag = this.gameInfoService.tableTag;
    let urlPreparation = this.configUrlRequestForQuestionForJoiner.replace('hostUser=xxxx','hostUser='+ hostUser);
    urlPreparation = urlPreparation.replace("tableTag=xxxx", "tableTag="+ tableTag);
    let request = this.http.get(urlPreparation, httpOptions);
    return request;
  }

  GetQuestionWinneFromDatabase(): Observable<any> 
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Access-Control-Allow-Headers':'*'
                              })
                        }
    let hostUser = this.gameInfoService.hostUser;
    let tableTag = this.gameInfoService.tableTag;
    let questionID = this.gameInfoService.questionID;
    let urlPreparation = this.configUrlGetQuestionWinner.replace('hostUser=xxxx','hostUser='+ hostUser);
    urlPreparation = urlPreparation.replace("tableTag=xxxx", "tableTag="+ tableTag);
    urlPreparation = urlPreparation.replace("questionID=xxxx", "questionID="+ questionID);
    let request = this.http.get(urlPreparation, httpOptions);
    return request;
  }


  GetScoreFromDatabase(): Observable<any> 
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Access-Control-Allow-Headers':'*'
                              })
                        }
    let hostUser = this.gameInfoService.hostUser;
    let tableTag = this.gameInfoService.tableTag;
    let urlPreparation = this.configUrlGetScore.replace('hostUser=xxxx','hostUser='+ hostUser);
    urlPreparation = urlPreparation.replace("tableTag=xxxx", "tableTag="+ tableTag);
    let request = this.http.get(urlPreparation, httpOptions);
    return request;
  }
  HostName(): Observable<any> 
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Access-Control-Allow-Headers':'*'
                              })
                        }
    let tableTag = this.gameInfoService.tableTag;
    let request = this.http.get(this.configUrlCheckHost.replace('tableTag=xxxx','tableTag='+ tableTag), httpOptions);
    // console.log(request)
    return request;
  }

  JoinTable(): Observable<any> 
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,POST',
        'Access-Control-Allow-Headers':'*'
                              })
                        }
    let user= this.gameInfoService.userName;
    let hostUser = this.gameInfoService.hostUser;
    let tableTag = this.gameInfoService.tableTag;
    let urlPreparation = this.configUrlJoinInaExistingTable.replace('user=xxxx','user='+ user);
    urlPreparation = urlPreparation.replace("hostUser=xxxx", "hostUser="+ hostUser);
    urlPreparation = urlPreparation.replace("table_tag=xxxx", "table_tag=" + tableTag);
    let request = this.http.get(urlPreparation, httpOptions);
    // console.log(request)
    return request;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
