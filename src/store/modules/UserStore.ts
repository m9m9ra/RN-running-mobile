import {makeAutoObservable} from "mobx";
import {dataSourse} from "../../configs/DataSourse";
import {User} from "../../entity/User";
import BackgroundService from "react-native-background-actions";

export default class UserStore {
    public auth: boolean = false;
    public stepCounter: number = 0;

    private userRepositoty = dataSourse.getRepository(User);

    constructor() {
        makeAutoObservable(this)
    }

    main = async () => {
        // await dataSourse.initialize();
        console.log(`success`);

        const sleep = (time) => new Promise((resolve) => setTimeout(() => {}, time));
        const veryIntensiveTask = async (taskDataArguments) => {
            // Example of an infinite loop task
            const { delay } = taskDataArguments;
            await new Promise( async (resolve) => {
                for (let i = 0; BackgroundService.isRunning(); i++) {
                    console.log(i);
                    await sleep(delay);
                }
            });
        };

        const options = {
            taskName: 'Example',
            taskTitle: 'ExampleTask title',
            taskDesc: 'ExampleTask description',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            parameters: {
                delay: 1000,
            },
        };

        // await BackgroundService.start(veryIntensiveTask, options);
    }
};