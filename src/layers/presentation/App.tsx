import { useTranslation } from "react-i18next";
import {enGB, registerTranslation} from "react-native-paper-dates";
import {observer} from "mobx-react-lite";
import {PermissionsAndroid, SafeAreaView, StatusBar, useColorScheme} from "react-native";
import React, {useEffect, useState} from "react";
import {getLocales} from "react-native-localize";
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from "react-native-paper";
import {useRootStore} from "./shared/store/RootStore";
import LoadStorage from "../domain/usecase/LoadStorage";
import {NavigationContainer} from "@react-navigation/native";
import {MainStack} from "../../core/navigation/MainStack";
import {AuthStack} from "../../core/navigation/AuthStack";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {LoadingScreen} from "./screens/LoadingScreen";
import {openSettings, PERMISSIONS, request} from "react-native-permissions";
import {useNetInfo} from "@react-native-community/netinfo";
registerTranslation('en-GB', enGB)


export const App = observer(() => {
    const isDarkMode = useColorScheme() === 'dark';
    const {userStore, settingStore, startStepCounterService, dataStore, initialize} = useRootStore();
    const {i18n} = useTranslation();
    const [loading, setLoading] = useState<boolean>(true);
    const { type, isConnected } = useNetInfo();

    const storage = new LoadStorage();

    // todo - netInfo ?
    useEffect(() => {
        console.log(getLocales());
        console.log(type, isConnected);

        loading ?
                storage.loadStorage()
                        .then(() => {
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
                                                        initialize().then();
                                                        setLoading(false);
                                                    });
                                        })
                            })
                        })
                :
                false;

        try {
            request(
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    {
                        title: 'Prodman Running location Permission',
                        message:
                                'Prodman Running App needs access to your location always',
                        buttonPositive: 'OK',
                    }
            ).then((granted) => {
                console.log(granted)
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the location")
                } else {
                    console.log("location permission denied")
                    openSettings().then(r => {})
                }
            })
        } catch (err) {
            console.warn(err);
        }
    }, []);

    return (
        <PaperProvider theme={settingStore.them == "DARK" ? MD3DarkTheme : MD3LightTheme}>
            <SafeAreaView style={{backgroundColor: settingStore.them == "DARK" ? Colors.lighter : Colors.darker, flex: 1}}>
                <StatusBar barStyle={settingStore.them == "DARK" ? `light-content` : 'dark-content'}
                           backgroundColor={settingStore.them !== "DARK" ? Colors.lighter : Colors.darker}/>
                {loading ?
                        <LoadingScreen/>
                        :
                        <NavigationContainer independent={true}>
                            {userStore.auth ?
                                    <MainStack/>
                                    :
                                    <AuthStack/>}
                        </NavigationContainer>
                }
            </SafeAreaView>
        </PaperProvider>
    );
});