import {createContext, useContext} from "react";
import UserStore from "./modules/UserStore";
import ErrorStore from "./modules/ErrorStore";

class RootStore {
    public userStore: UserStore;
    public errorStore: ErrorStore;

    constructor() {
        this.errorStore = new ErrorStore();
        this.userStore = new UserStore(this.errorStore);
    };

};

const rootStore = new RootStore();
const storeContext = createContext(rootStore);
export const useRootStore = () => useContext(storeContext);