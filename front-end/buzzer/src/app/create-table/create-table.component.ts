import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service'
import {GameInfoService} from '../game-info.service'
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css']
})
export class CreateTableComponent implements OnInit 
{
  user = ""
  tableName = "";
  TableId:string;
  IsJoinSucceed =false;
  hostName = ""
  response = ""
  emailPlaceholderText="Input Table Number"
  constructor(private gameInfoService:GameInfoService, private api: ApiService, private router: Router) { 
    this.user = gameInfoService.userName;
  }

  ngOnInit(): void {
  }

  CreateTable(){
    this.api.CreateTable() //Not catching the first response.
    .subscribe
    (
      data => {
        this.response = data;
        if (this.response){
          this.gameInfoService.tableTag = this.response;
          this.tableName = this.response;
          this.gameInfoService.hostUser = this.user;
          this.hostName=this.user;
          console.log(this.gameInfoService.tableTag);
          this.router.navigate(['/table']);
        }
        else this.tableName="Something wrong when creating table"
              }
    );
    console.log(this.tableName)
  }

  HostName(){
    this.gameInfoService.tableTag = this.TableId;
    this.api.HostName() //Not catching the first response.
    .subscribe
    (
      data => {
        this.gameInfoService.hostUser= data[0];
        this.hostName = this.gameInfoService.hostUser;
        console.log(this.hostName)
        this.JoinTable()
      }
    );
  }
  JoinTable(){
    console.log(this.TableId)
    this.api.JoinTable() //Not catching the first response.
    .subscribe
    (
      data => {
        this.IsJoinSucceed = data;
        if (this.IsJoinSucceed){
          this.tableName= this.gameInfoService.tableTag;
          
        }
        else this.tableName=this.gameInfoService.tableTag;
        this.router.navigate(['/table']);
      }
    );
    console.log(this.IsJoinSucceed)
  }
  onKey(event : any){
    console.log(event)
  }
}