import { History } from "history"; 
import { history } from "./utils/history";

let instance: AppContext;

class AppContext {
    public history: History;

    constructor() {
        this.history = history;
    }

    getInstance() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }
}

const appContext = new AppContext();

export { appContext };
