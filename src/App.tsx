import {Platform, SafeAreaView, ScrollView, StatusBar, useColorScheme} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {Button, MD3LightTheme, PaperProvider, Text} from "react-native-paper";
import {useRootStore} from "./store/RootStore";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {useStepCounter} from "./modules/StepCounter";

import BackgroundJob from 'react-native-background-actions';

const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask desc',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
        delay: 1000,
    },
};

export const App = observer((): JSX.Element => {
    const [steps, setSteps] = useState<number>(0);
    const {stepCount, startCounter, stopCounter} = useStepCounter();
    const isDarkMode = useColorScheme() === 'dark';
    const {userStore} = useRootStore();
    let playing = BackgroundJob.isRunning();

    const taskRandom = async (taskData: any) => {
        if (Platform.OS === 'ios') {
            console.warn(
                'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
                'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
            );
        }
        await new Promise(async (resolve) => {
            const { delay } = taskData;
            // for (let i = 0; BackgroundJob.isRunning(); i++) {
            //     await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
            //     await sleep(delay);
            // }
            startCounter();
        });
    };

    const toggleBackground = async () => {
        playing = !playing;
        if (playing) {
            try {
                console.log('Trying to start background service');
                await BackgroundJob.start(taskRandom, options);
                console.log('Successful start!');
            } catch (e) {
                console.log('Error', e);
            }
        } else {
            console.log('Stop background service');
            await BackgroundJob.stop();
        }
    };

    useEffect(() => {

        userStore.main()
            .then(() => {
                console.log(1);
            });
    }, []);

    const backgroundStyle = {
        backgroundColor: Colors.lighter // isDarkMode ? Colors.darker :
    };

    return (
        <PaperProvider theme={MD3LightTheme}>
            <SafeAreaView style={{...backgroundStyle, flex: 1}}>
                <StatusBar barStyle={'dark-content'}
                           backgroundColor={backgroundStyle.backgroundColor}/>
                <ScrollView contentInsetAdjustmentBehavior="automatic"
                            style={backgroundStyle}>
                    <Text children={`Шагов пройдено: ${stepCount}`}
                          style={{
                              marginTop: 20,
                              fontSize: 34,
                              textAlign: `center`
                          }}/>
                    <Button children={`Начать тренировку`}
                            onPress={async () => {
                                await toggleBackground();
                            }}
                            style={{
                                width: `66%`,
                                marginVertical: 2
                            }}
                            mode={`outlined`}/>
                    <Button children={`Закончить тренировку`}
                            onPress={() => {
                                stopCounter();
                            }}
                            style={{
                                width: `60%`,
                                marginVertical: 2
                            }}
                            mode={`contained`}/>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
});