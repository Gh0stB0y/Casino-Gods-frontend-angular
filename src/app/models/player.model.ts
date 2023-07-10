import {Input} from '@angular/core';
import { count } from 'rxjs';
export interface Player{
    id: string;
    username: string;
    email: string;
    password: string;
    bankroll: number;
    profit:number;
    birthdate:string;
}
export interface PlayerStats{

}
export interface PlayerSignUp{
    username: string;
    email: string;
    birthdate:string;
    password: string;
}
export interface PlayerSignIn{
    username: string;
    password: string;
}

export interface jwt{
    jwtString: string;
}
export interface EmailRec{
    emailRec: string;
}
export interface ActivePlayer{
    username:string;
    bankroll:number;
    profit:number;
    jwt: string;
}
export interface TableData{
    jwt:string;
    gameNames:string[];  
}
export interface LobbyDataInput{
    jwt:string;
    ChosenGame:string
}
export interface LobbyTableDataDTO{
    id:string;
    tablePath:string;
    name:string;
    minBet:number;
    maxBet:number;
    betTime:number;
    sidebets:boolean;
    maxSeats:number;
}
export interface TableInfoStrings{
    Name:string;
    minBet:string;
    maxBet:string;
    betTime:string;
    sidebets:string;
    maxSeats:string;
}
export interface ChatMessages{
    text:string;
    text2:string;
    textColor:string;
    text2Color:string;
}
export interface LobbyConnectionData{
    jwt:string;
    username:string;
}
export interface TableConnectionData{
    jwt:string;
    username:string;
    TableId:string;
    TablePath:string;
}