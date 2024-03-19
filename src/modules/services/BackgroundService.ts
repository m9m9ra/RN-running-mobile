import {action, makeObservable, observable, runInAction} from "mobx";
import {Platform} from "react-native";
import BackgroundJob from "react-native-background-actions";

const options = {
    taskName: 'stepCounter',
    taskTitle: 'Prodman runing',
    taskDesc: '',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
        delay: 1000,
    },
};

export class BackgroundService {
    public playing: boolean = BackgroundJob.isRunning();

    constructor() {
        makeObservable(this, {
            playing: observable,
            startBackgroundTask: action,
            stopBackgroundTask: action
        })
    }

    public startBackgroundTask = async (task: () => unknown) => {
        runInAction(() => {
            this.playing = true;
        });

        try {
            console.log('Trying to start background service');
            await BackgroundJob.start(async (taskData: any): Promise<void> => {
                if (Platform.OS === 'ios') {
                    console.warn(
                        'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
                        'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
                    );
                }
                await new Promise(async (resolve): Promise<void> => {
                    task();
                });
            }, options);
            console.log('Successful start!');
        } catch (e) {
            console.log('Error', e);
        }
    }

    public stopBackgroundTask = async () => {
        runInAction(() => {
            this.playing = false;
        });

        console.log('Stop background service');
        await BackgroundJob.stop();
    }
};