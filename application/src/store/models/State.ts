import { User } from "../../models/User";

export class State {
    public isLoggedIn: boolean = false;
    public user: User = new User();
}