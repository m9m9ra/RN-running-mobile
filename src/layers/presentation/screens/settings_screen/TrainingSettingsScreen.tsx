import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {useEffect, useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Appbar, Divider, Icon, RadioButton, Text, TextInput} from "react-native-paper";
import {observer} from "mobx-react-lite";
import {MainStackParamList} from "../../../../core/navigation/MainStack";
import {useRootStore} from "../../shared/store/RootStore";
import {AppBar} from "../../shared/ui/AppBar";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {Settings} from "../../../domain/entity/Settings";

type props = DrawerScreenProps<MainStackParamList, `TrainingsSettingsScreen`>;
export const TrainingsSettingsScreen = observer(({navigation, route}: props) => {
    const {t, i18n} = useTranslation();
    const [languages, setLanguages] = useState<string[]>(Object.keys(i18n.options.resources));
    const [currentLanguages, setCurrentLanguages] = useState<string>(i18n.language);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {settingStore} = useRootStore();

    const [currentSetting, setCurrentSetting] = useState<Settings>(settingStore.settings);

    useLayoutEffect(() => {

        navigation.setOptions({
            headerShown: true,
            header: () => {
                return (
                        <Appbar.Header elevated
                                       style={{
                                           backgroundColor: Colors.lighter,
                                           paddingRight: 18
                                       }}>
                            <Appbar.BackAction onPress={() => {
                                navigation.goBack();
                            }}/>
                            <Appbar.Header mode={`small`}
                                           children={<Text children={`${t("SETTINGS_MENU.TRAINING")}`}
                                                           style={{
                                                               width: `80%`,
                                                               fontWeight: `700`,
                                                               letterSpacing: 1,
                                                               textAlign: `center`
                                                           }}/>}
                                           style={{
                                               backgroundColor: Colors.lighter
                                           }}/>
                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  setRefreshing(true);
                                                  settingStore.changeSetting(currentSetting)
                                                          .then(() => {
                                                              setRefreshing(false);
                                                              navigation.goBack();
                                                          });
                                              }}
                                              children={<Icon size={26}
                                                              source={"content-save-cog-outline"}/>}/>
                        </Appbar.Header>
                )
            }
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
                <Text children={`Map settings`}
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
                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <Text children={`Zoom`}
                              style={{
                                  fontWeight: `700`,
                                  fontSize: 14,
                                  letterSpacing: 0.8
                              }}/>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 16
                        }}>
                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  if (currentSetting.mapZoom > 5) {
                                                      setCurrentSetting({
                                                          ...currentSetting,
                                                          mapZoom: currentSetting.mapZoom - 1
                                                      });
                                                  }
                                                  console.log(currentSetting)
                                              }}
                                              children={<Icon size={26}
                                                              source={`minus`}/>}/>

                            <Text children={`${currentSetting.mapZoom}`}
                                  style={{
                                      fontWeight: `700`,
                                      fontSize: 16,
                                      letterSpacing: 0.8
                                  }}/>

                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  if (currentSetting.mapZoom < 21) {
                                                      setCurrentSetting({
                                                          ...currentSetting,
                                                          mapZoom: currentSetting.mapZoom + 1
                                                      });
                                                  }
                                                  console.log(currentSetting)
                                              }}
                                              children={<Icon size={26}
                                                              source={`plus`}/>}/>
                        </View>
                    </View>
                    <Divider/>
                </View>
            </ScrollView>
    )
});

const style
        =
        StyleSheet.create
        ({
            container:
                    {
                        flexGrow: 1,
                        paddingHorizontal: 24
                    }
        });