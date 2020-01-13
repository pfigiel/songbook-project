export class State {
    public user: User = new User();
}

export class User {
    public email: string = "";
    public roles: string[] = [];
    public jwtToken: string = "";
    public refreshToken: string = "";
    public isLoggedIn: boolean = false;
}