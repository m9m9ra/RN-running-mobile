import {createContext, useContext} from "react";
import UserStore from "./modules/UserStore";

class RootStore {
    public userStore: UserStore;

    constructor() {
        this.userStore = new UserStore();
    };

};

const rootStore = new RootStore();
const storeContext = createContext(rootStore);
export const useRootStore = () => useContext(storeContext);