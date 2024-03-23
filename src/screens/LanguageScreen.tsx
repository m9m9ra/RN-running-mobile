import {RefreshControl, ScrollView, StyleSheet, View} from "react-native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {MainStackParamList} from "../navigation/MainStack";
import {useLayoutEffect, useState} from "react";
import {AppBar} from "../components/AppBar";
import {useTranslation} from "react-i18next";
import {RadioButton, Text} from "react-native-paper";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../store/RootStore";

type props = DrawerScreenProps<MainStackParamList, `LanguageScreen`>;
export const LanguageScreen = observer(({navigation, route}: props) => {
    const {t, i18n} = useTranslation();
    const [languages, setLanguages] = useState<string[]>(Object.keys(i18n.options.resources));
    const [currentLanguages, setCurrentLanguages] = useState<string>(i18n.language);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {settingStore} = useRootStore();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => <AppBar title={t('LANGUAGE')}
                                  action={() => navigation.navigate('SettingsScreen')}/>
        });
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1450);
    };

    return (
            <ScrollView horizontal={false}
                        refreshControl={<RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}
                        contentContainerStyle={style.container}>
                <Text children={t("LANGUAGE")}
                      style={{
                          fontWeight: `700`,
                          fontSize: 16,
                          marginTop: 24,
                          marginBottom: 18,
                          letterSpacing: 0.8
                      }}/>
                <View style={{
                    gap: 12
                }}>
                    {languages.map((item: string, index: number) => {
                        return (
                                <View key={index}
                                      style={{
                                          flexDirection: `row`,
                                          alignItems: `center`,
                                          gap: 6
                                      }}>
                                    <RadioButton value={item}
                                                 disabled={refreshing}
                                                 status={currentLanguages == item ? 'checked' : 'unchecked'}
                                                 onPress={async () => {
                                                     onRefresh();
                                                     console.log(item);

                                                     setCurrentLanguages(item);
                                                     await i18n.changeLanguage(item);
                                                     // @ts-ignore
                                                     await settingStore.setLanguage(item);
                                                 }}/>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: `row`,
                                        alignItems: `center`,
                                        justifyContent: `space-between`
                                    }}>
                                        <Text children={String(i18n.options.resources[item].translation[`TRANSLATE`])}
                                              style={{
                                                  fontSize: 14,
                                                  fontWeight: `700`
                                              }}/>
                                        <Text children={String(i18n.options.resources[item].translation[`TRANSLATE_EN`])}
                                              style={{
                                                  fontSize: 12
                                              }}/>
                                    </View>
                                </View>
                        )
                    })}
                </View>
            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24
    }
});