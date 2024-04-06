import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {observer} from "mobx-react-lite";
import {Appbar, Avatar, Caption, Icon, List, Text, Title} from "react-native-paper";
import {DrawerHeaderProps, DrawerScreenProps} from "@react-navigation/drawer";
import {useLayoutEffect, useState} from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {DrawerActions} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {MainStackParamList} from "../../../core/navigation/MainStack";
import {useRootStore} from "../shared/store/RootStore";

// @ts-ignore
type props = DrawerScreenProps<MainStackParamList, `SettingsScreen`>;
export const SettingsScreen = observer(({navigation, route}: props) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {t} = useTranslation();
    const {userStore, settingStore} = useRootStore();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (props: DrawerHeaderProps) => {
                return (
                        <Appbar.Header elevated
                                       style={{
                                           paddingHorizontal: 18,
                                           backgroundColor: Colors.lighter
                                       }}>
                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  navigation.goBack();
                                              }}
                                              children={<Icon size={24}
                                                              source={"arrow-left"}/>}/>
                            {/* <Badge children={3}/> */}
                            <Appbar.Header mode={`small`}
                                           children={<Text children={`${t("DRAWER_MENU.SETTINGS")}`}
                                                           style={{
                                                               width: `82%`,
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
                                                  setTimeout(() => {
                                                      setRefreshing(false);
                                                  }, 1450)
                                              }}
                                              children={<Icon size={28}
                                                              source={"content-save-cog-outline"}/>}/>
                        </Appbar.Header>
                )
            }
        });
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1450)
    };

    return (
            <ScrollView horizontal={false}
                        refreshControl={<RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}
                        contentContainerStyle={style.container}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: `center`,
                    gap: 6
                }}>

                    <Avatar.Text label={`${userStore.user.firstName}`}
                                 color={`#FFF`}
                                 style={{
                                     backgroundColor: `gray`
                                 }}
                                 size={46}/>

                    <View style={{marginLeft: 7, flexDirection: 'column'}}>
                        <Title children={`${userStore.user.firstName} | ${userStore.user.lastName}`.slice(0, 19)}
                               style={{
                                   fontSize: 18,
                                   marginTop: 1,
                                   fontWeight: '700',
                               }}/>
                        <Caption children={`${userStore.user.email}`.slice(0, 19)}
                                 style={{
                                     fontSize: 17,
                                     fontWeight: `600`,
                                     lineHeight: 16.2
                                 }}/>
                    </View>
                </View>

                {/*<List.Section style={{*/}
                {/*    // backgroundColor: "#e7e0ec",*/}
                {/*    // gap: 12*/}
                {/*}}>*/}
                {/*    <List.Subheader children={`Account`}*/}
                {/*                    style={{*/}
                {/*                        fontWeight: `700`,*/}
                {/*                        fontSize: 14*/}
                {/*                    }}/>*/}
                {/*    <TextInput label="Tap to change email"*/}
                {/*               value={""}*/}
                {/*               placeholder={`Email`}*/}
                {/*               maxLength={40}*/}
                {/*               inputMode={`email`}*/}
                {/*               onChangeText={() => {*/}

                {/*               }}/>*/}

                {/*    <TextInput label="Tap to change phone number"*/}
                {/*               value={""}*/}
                {/*               onChangeText={() => {*/}

                {/*               }}/>*/}
                {/*</List.Section>*/}
                <View>
                    <Text children={t(`DRAWER_MENU.SETTINGS`)}
                          style={{
                              fontWeight: `700`,
                              fontSize: 16,
                              marginTop: 24,
                              marginBottom: 18,
                              letterSpacing: 0.8
                          }}/>

                    <TouchableOpacity disabled={refreshing}
                                      onPress={() => {
                                          navigation.navigate("LanguageScreen", settingStore.settings);
                                      }}
                                      children={<List.Item title={`${t("LANGUAGE")}`}
                                                           right={() => <Text children={`${t("TRANSLATE")}`}
                                                                              style={{
                                                                                  fontWeight: `700`
                                                                              }}/>}
                                                           left={() => <List.Icon color={'gray'}
                                                                                  icon="google-translate"/>}/>}/>
                </View>

            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 24,
        paddingHorizontal: 24,
        gap: 12
    },
    card: {
        backgroundColor: `#FFFFFF`,
        maxHeight: 62,
        paddingHorizontal: 12,
        paddingVertical: 13,
        borderRadius: 2,
        flexDirection: `row`,
        alignItems: `center`,
        justifyContent: `space-between`,
        elevation: 4
    },
    topPanel: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 7,
        backgroundColor: "#e5d9ee",
        gap: 20
    }
});