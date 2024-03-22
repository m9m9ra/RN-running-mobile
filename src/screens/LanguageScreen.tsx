import {Alert, BackHandler, ScrollView, StyleSheet} from "react-native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {MainStackParamList} from "../navigation/MainStack";
import {useCallback, useLayoutEffect} from "react";
import {AppBar} from "../components/AppBar";

type props = DrawerScreenProps<MainStackParamList, `LanguageScreen`>;
export const LanguageScreen = ({navigation, route}: props) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => <AppBar title={'Language'} action={() => navigation.navigate('SettingsScreen')}/>
        });

    }, [navigation]);

    return (
            <ScrollView horizontal={false} contentContainerStyle={style.container}>

            </ScrollView>
    )
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1
    }
});