import { ActionResult } from "../../utils/ActionResult";

export class AuthenticateResult extends ActionResult {
    public jwtToken: string = "";
    
    static WRONG_CREDENTIALS: string = "wrongCredentials";
    static SERVER_ERROR: string = "serverError";
}