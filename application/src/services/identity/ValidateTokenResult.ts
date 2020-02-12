import { ActionResult } from "../../utils/ActionResult";
import { User } from "../../models/User";

export class ValidateTokenResult extends ActionResult {
    public isTokenValid = false;
    public user: User = {} as User;
}