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
