import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../store/RootStore";
import {Activity} from "../entity/Activity";
import {Appbar, Avatar, Caption, Icon, List, MD3Colors, Text, TextInput, Title} from "react-native-paper";
import {DrawerHeaderProps, DrawerScreenProps} from "@react-navigation/drawer";
import {MainStackParamList} from "../navigation/MainStack";
import {TotalStep} from "../components/TotalStep";
import {useLayoutEffect, useState} from "react";
import {AppBar} from "../components/AppBar";
import {BottomTabHeaderProps} from "@react-navigation/bottom-tabs";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {DrawerActions} from "@react-navigation/native";
import {useTranslation} from "react-i18next";

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
                                           paddingHorizontal: 24,
                                           backgroundColor: Colors.lighter
                                       }}>
                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  navigation.dispatch(DrawerActions.openDrawer())
                                              }}
                                              children={<Icon size={28}
                                                              source={"menu"}/>}/>
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

                <List.Section style={{
                    // backgroundColor: "#e7e0ec",
                    // gap: 12
                }}>
                    <List.Subheader children={`Settings`}
                                    style={{
                                        fontWeight: `700`,
                                        fontSize: 14
                                    }}/>

                    <TouchableOpacity disabled={false}
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

                </List.Section>

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