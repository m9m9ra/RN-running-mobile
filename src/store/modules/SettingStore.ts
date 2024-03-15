import {makeAutoObservable} from "mobx";
import {dataSourse} from "../../configs/DataSourse";
import ErrorStore from "./ErrorStore";
import {Settings} from "../../entity/Settings";

export default class SettingStore {
    public auth: boolean = false;
    public stepCounter: number = 0;

    private errorStore: ErrorStore;
    private userRepositoty = dataSourse.getRepository(Settings);

    constructor(errorStore: ErrorStore) {
        this.errorStore = errorStore;
        makeAutoObservable(this);
    }

    main = async () => {
    }
};