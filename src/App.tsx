import {PermissionsAndroid, Platform, SafeAreaView, ScrollView, StatusBar, useColorScheme, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {Button, MD3LightTheme, PaperProvider, Text} from "react-native-paper";
import {useRootStore} from "./store/RootStore";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {useStepCounter} from "./modules/StepCounter";

import BackgroundJob from 'react-native-background-actions';
import Geolocation from "@react-native-community/geolocation";

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

// Configure Geolocation
Geolocation.setRNConfiguration({
    authorizationLevel: 'always', // Request "always" location permission
    skipPermissionRequests: false, // Prompt for permission if not granted
});

// To stop tracking (for example, when the component unmounts):
// Geolocation.clearWatch(watchId);

export const App = observer((): JSX.Element => {
    const [steps, setSteps] = useState<number>(0);
    const {stepCount, startCounter, stopCounter} = useStepCounter();
    const isDarkMode = useColorScheme() === 'dark';
    const {userStore} = useRootStore();
    const [location, setLocation] = useState<Array<any>>([]);
    let playing = BackgroundJob.isRunning();

    const taskRandom = async (taskData: any): Promise<void> => {
        if (Platform.OS === 'ios') {
            console.warn(
                'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
                'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
            );
        }
        await new Promise(async (resolve): Promise<void> => {
            startCounter();
        });
    };

    const toggleBackground = async (): Promise<void> => {
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

    // Watch for position updates
    const watchId = Geolocation.watchPosition(
        position => {
            console.log(position);
            setLocation([...location, position]);
            // Send the position data to the server
        },
        error => {
            console.log(`error`, error);
        },
        {
            distanceFilter: 0, // Minimum distance (in meters) to update the location
            interval: 600, // Update interval (in milliseconds), which is 15 minutes
            fastestInterval: 600, // Fastest update interval (in milliseconds)
            accuracy: {
                android: 'highAccuracy',
                ios: 'best',
            },
            showsBackgroundLocationIndicator: true,
            pausesLocationUpdatesAutomatically: false,
            activityType: 'fitness', // Specify the activity type (e.g., 'fitness' or 'other')
            useSignificantChanges: false,
            deferredUpdatesInterval: 0,
            deferredUpdatesDistance: 0,
            foregroundService: {
                notificationTitle: 'Tracking your location',
                notificationBody: 'Enable location tracking to continue', // Add a notification body
            },
        }
    );


    useEffect(() => {
        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use locations ")
                } else {
                    console.log("Location permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
        };
        requestLocationPermission().then();

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
                    <View style={{alignItems: `center`, gap: 12, marginVertical: 24}}>
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
                                    // Geolocation.clearWatch(watchId);
                                    // Geolocation.stopObserving();
                                }}
                                style={{
                                    width: `60%`,
                                    marginVertical: 2
                                }}
                                mode={`contained`}/>
                    </View>
                    <View style={{gap: 12}}>
                        {location.map((item, index) =>
                            <Text key={index}
                                  style={{
                                      textAlign: `center`,
                                      fontSize: 14
                                  }}
                                  children={JSON.stringify(item)}/>)}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
});