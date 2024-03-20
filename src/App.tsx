import {PermissionsAndroid, SafeAreaView, StatusBar, useColorScheme, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {MD3LightTheme, PaperProvider} from "react-native-paper";
import {useRootStore} from "./store/RootStore";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {enGB, registerTranslation} from 'react-native-paper-dates'
import {getLocales} from "react-native-localize";
import {NavigationContainer} from "@react-navigation/native";
import {AuthStack} from "./navigation/AuthStack";
import {MainStack} from "./navigation/MainStack";
import {useServiceProvider} from "./modules/ServicesProvider";
import { useTranslation } from "react-i18next";
registerTranslation('en-GB', enGB)


export const App = observer((): JSX.Element => {
    const isDarkMode = useColorScheme() === 'dark';
    const {startStepCounterService} = useServiceProvider();
    const {userStore, settingStore} = useRootStore();
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
                    i18n.changeLanguage(settingStore.settings.language);
                });
            })
    }, []);

    const backgroundStyle = {
        backgroundColor: Colors.lighter // isDarkMode ? Colors.darker :
    };

    return (
        <PaperProvider theme={MD3LightTheme}>
            <SafeAreaView style={{...backgroundStyle, flex: 1}}>
                <StatusBar barStyle={'dark-content'}
                           backgroundColor={backgroundStyle.backgroundColor}/>
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