import { Component, OnInit } from '@angular/core';
import { GameInfoService } from '../game-info.service';
import { Router, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName:string;
  UserMissing= "";
  constructor(private gameInfo:GameInfoService, private router:Router) { }

  SetUserName()
  {
    if (this.userName){
      this.gameInfo.userName = this.userName
      this.UserMissing = ""
      this.router.navigate(['/createtable'])
    }
    else{
      this.UserMissing="Please Put user name"
    }
    }

  ngOnInit(): void {
  }
}
