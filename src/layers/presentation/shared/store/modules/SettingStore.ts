import {makeAutoObservable, runInAction} from "mobx";
import {Settings} from "../../../../domain/entity/Settings";
import ErrorStore from "./ErrorStore";
import {dataSourse} from "../../../../data/dto/DataSourse";

export default class SettingStore {
    public settings: Settings;
    public them: Settings['them'] = "LIGHT";

    private errorStore: ErrorStore;
    private settingRepository = dataSourse.getRepository(Settings);

    constructor(errorStore: ErrorStore) {
        this.errorStore = errorStore;
        makeAutoObservable(this);
    };

    public main = async () => {
        const current = await this.settingRepository.find({});
        if (current.length > 0) {
            runInAction(() => {
                this.settings = current[0];
                this.them = current[0].them;
            });
            console.log(`Setting loaded`);
        } else {
            console.log(`Setting created`);
            const newSettings = Object.assign(new Settings, {
                settings: true,
                language: 'en',
                them: `LIGHT`
            });
            const setting = await this.settingRepository.save(newSettings);
            runInAction(() => {
                this.settings = setting;
                this.them = setting.them;
            })
        }
    };

    public changeSetting = async (setting: Settings): Promise<boolean> => {
        const currentSetting: Settings = await this.settingRepository.findOne({});

        if (currentSetting != null) {
            await this.settingRepository.save({
                ...currentSetting,
                ...setting
            });
            return true;
        } else {
            const newSettings = Object.assign(new Settings, {
                settings: true,
                language: "en",
                them: `LIGHT`
            });
            await this.settingRepository.save(newSettings);
        }
    }

    public setLanguage = async (language: "ru" | "en"): Promise<any> => {
        const current = await this.settingRepository.find({
            where: {
                settings: true || false
            }
        });
        if (current[0] != null) {
            current[0].language = language;
            await this.settingRepository.save(current[0]);
            return true;
        } else {
            const newSettings = Object.assign(new Settings, {
                settings: true,
                language: language,
                them: `LIGHT`
            });
            await this.settingRepository.save(newSettings);
        }
    };
};