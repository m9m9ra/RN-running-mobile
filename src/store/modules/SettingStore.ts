import {makeAutoObservable, runInAction} from "mobx";
import {dataSourse} from "../../configs/DataSourse";
import ErrorStore from "./ErrorStore";
import {Settings} from "../../entity/Settings";

export default class SettingStore {
    public settings: Settings;

    private errorStore: ErrorStore;
    private settingRepositoty = dataSourse.getRepository(Settings);

    constructor(errorStore: ErrorStore) {
        this.errorStore = errorStore;
        makeAutoObservable(this);
    };

    public main = async () => {
        const current = await this.settingRepositoty.find({});
        if (current.length > 0) {
            runInAction(() => {
                this.settings = current[0];
            });
            console.log(`Setting loaded`);
        } else {
            const newSettings = Object.assign(new Settings, {
                settings: true,
                language: 'en',
                them: `LIGHT`
            });
            const setting = await this.settingRepositoty.save(newSettings);
            runInAction(() => {
                this.settings = setting;
            })
        }
    };

    public setLaunguage = async (language: "ru" | "en"): Promise<boolean> => {
        const current = await this.settingRepositoty.findOne({});
        if (current != null) {
            current.language = language;
            await this.settingRepositoty.save(current);
            return true;
        } else {
            const newSettings = Object.assign(new Settings, {
                settings: true,
                language: language,
                them: `LIGHT`
            });
            await this.settingRepositoty.save(newSettings);
        }
    };
};