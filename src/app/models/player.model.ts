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