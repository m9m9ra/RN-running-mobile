import {PermissionsAndroid, SafeAreaView, StatusBar, useColorScheme, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from "react-native-paper";
import {useRootStore} from "./store/RootStore";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {enGB, registerTranslation} from 'react-native-paper-dates'
import {getLocales} from "react-native-localize";
import {NavigationContainer} from "@react-navigation/native";
import {AuthStack} from "./navigation/AuthStack";
import {MainStack} from "./navigation/MainStack";
import { useTranslation } from "react-i18next";
registerTranslation('en-GB', enGB)


export const App = observer((): JSX.Element => {
    const isDarkMode = useColorScheme() === 'dark';
    const {userStore, settingStore, startStepCounterService, dataStore} = useRootStore();
    const {i18n} = useTranslation();


    useEffect(() => {
        console.log(getLocales());

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

        dataStore.main().then(() => {
            userStore.main()
                    .then(() => {
                        console.log(1);

                        startStepCounterService().then(() => {
                            console.log(`Pedometer`);
                        });
                    })
                    .finally(() => {
                        settingStore.main()
                                .then(() => {
                                    console.log(settingStore.settings);
                                    console.log(userStore.auth, "App.tsx");
                                    i18n.changeLanguage(settingStore.settings.language);

                                });
                    })
        });
    }, []);

    return (
        <PaperProvider theme={settingStore.them == "DARK" ? MD3DarkTheme : MD3LightTheme}>
            <SafeAreaView style={{backgroundColor: settingStore.them == "DARK" ? Colors.lighter : Colors.darker, flex: 1}}>
                <StatusBar barStyle={settingStore.them == "DARK" ? `light-content` : 'dark-content'}
                           backgroundColor={settingStore.them !== "DARK" ? Colors.lighter : Colors.darker}/>
                <NavigationContainer independent={true}>
                    {userStore.auth ?
                        <MainStack/>
                        :
                        <AuthStack/>}
                </NavigationContainer>
            </SafeAreaView>
        </PaperProvider>
    );
});