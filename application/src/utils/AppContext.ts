import { History } from "history";
import { history } from "./history";
import Cookies from "universal-cookie";
import { SongsService } from "../services/SongsService";

let instance: AppContext;

class AppContext {
  public history: History;
  public cookies: Cookies;
  public songsService: SongsService;

  public switchToEnglish(): void {}
  public switchToPolish(): void {}

  constructor() {
    this.history = history;
    this.cookies = new Cookies();
    this.songsService = new SongsService();
  }

  getInstance() {
    if (!instance) {
      instance = this;
    }

    return instance;
  }

  initializeLanguageSwitches(switchToPolish: any, switchToEnglish: any): void {
    this.switchToPolish = switchToPolish;
    this.switchToEnglish = switchToEnglish;
  }
}

const appContext = new AppContext();

export { appContext };
