import {makeAutoObservable, runInAction} from "mobx";
import {dataSourse} from "../../configs/DataSourse";
import {User} from "../../entity/User";
import ErrorStore from "./ErrorStore";

export default class UserStore {
    public auth: boolean = false;
    public guest: boolean = false;
    public user: User;
    public stepCounter: number = 0;

    private errorStore: ErrorStore;
    private userRepositoty = dataSourse.getRepository(User);

    constructor(errorStore: ErrorStore) {
        this.errorStore = errorStore;
        makeAutoObservable(this);
    };

    public main = async () => {
        !dataSourse.isConnected ? await dataSourse.initialize() : false;

        const user = await this.userRepositoty.findOne({
            where: {
                auth: true || false
            }
        });
        if (user !== null) {
            runInAction(() => {
                this.auth = user.auth;
                this.guest = user.guest;
                this.user = user;
            });
            console.log(`Storage loaded!`);
            console.log(user);
        }

    };

    public userRegister = async (user: User): Promise<boolean> => {
        if (this.user && this.auth) {
            return true
        }
        // todo - Guest auth
        const newUser = Object.assign(new User(), {
            ...user,
            auth: true,
            guest: false
        })
        const response = await this.userRepositoty.save(newUser);

        if (response !== null) {
            runInAction(() => {
                this.auth = true;
            })
            return true
        } else {
            return false
        }
    };

    public userLogout = async (): Promise<boolean> => {
        if (this.user) {
            const cacheUser = Object.assign(new User(), {
                ...this.user,
                auth: false,
                guest: false
            });

            await this.userRepositoty.remove(this.user);

            await this.userRepositoty.save(cacheUser)
                .finally(() => {
                    runInAction(() => {
                        this.auth = false;
                        this.guest = false;
                    })
                });
        } else {
            return false
        }
    }
};