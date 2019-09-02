import { IActionResult } from "../../utils/IActionResult";

export class AuthenticateResult extends IActionResult {
    public jwtToken: string = "";
    
    static WRONG_CREDENTIALS: string = "wrongCredentials";
    static SERVER_ERROR: string = "serverError";
}