import {Avatar, Caption, Divider, Drawer, Icon, Text, Title} from "react-native-paper";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../store/RootStore";
import {useTranslation} from "react-i18next";

export const DrawerMenu = observer((props: DrawerContentComponentProps) => {
    const {userStore} = useRootStore();
    const {t} = useTranslation();

    return (
            <DrawerContentScrollView {...props}
                                     style={style.drawer}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: `center`,
                    paddingLeft: 22,
                    backgroundColor: `#ffffff`,
                    gap: 6
                }}>

                    <Avatar.Text label={`${userStore.user.firstName}`}
                                 color={`#FFF`}
                                 style={{
                                     backgroundColor: `gray`
                                 }}
                                 size={44}/>

                    <View style={{marginLeft: 7, flexDirection: 'column'}}>
                        <Title children={`${userStore.user.firstName} | ${userStore.user.lastName}`.slice(0, 19)}
                               style={{
                                   fontSize: 14,
                                   marginTop: 1,
                                   fontWeight: '700',
                               }}/>
                        <Caption children={`${userStore.user.email}`.slice(0, 19)}
                                 style={{
                                     fontSize: 13,
                                     fontWeight: `600`,
                                     lineHeight: 14
                                 }}/>
                    </View>
                </View>

                <Divider style={{
                    backgroundColor: `gray`,
                    marginVertical: 10,
                    marginBottom: 20
                }}/>

                <View style={style.drawerSection}>

                    <TouchableOpacity style={style.drawerItem}
                                      onPress={() => {
                                          props.navigation.navigate(`HomeScreen`);
                                      }}>
                        <Icon size={28}
                              color={`gray`}
                              source={`chart-bar`}/>

                        <Text children={t("DRAWER_MENU.PROGRESS")}
                              style={style.drawerText}/>
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={style.drawerItem}*/}
                    {/*                  onPress={() => {*/}
                    {/*                      props.navigation.navigate(`ProfileScreen`);*/}
                    {/*                  }}>*/}
                    {/*    <Icon size={28}*/}
                    {/*          color={`gray`}*/}
                    {/*          source={`account-outline`}/>*/}
                    {/*    <Text children={t("DRAWER_MENU.SETTINGS")}*/}
                    {/*          style={style.drawerText}/>*/}
                    {/*</TouchableOpacity>*/}

                    <TouchableOpacity style={style.drawerItem}
                                      onPress={() => {
                                          props.navigation.navigate(`PedometerScreen`);
                                      }}>
                        <Icon size={28}
                              color={`gray`}
                              source={`foot-print`}/>
                        <Text children={t("DRAWER_MENU.PEDOMETER")}
                              style={style.drawerText}/>
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={style.drawerItem}*/}
                    {/*                  onPress={() => {*/}
                    {/*                      props.navigation.navigate(`LocationScreen`);*/}
                    {/*                  }}>*/}
                    {/*    <Icon size={28}*/}
                    {/*          color={`#EE7100`}*/}
                    {/*          source={`map-marker-radius-outline`}/>*/}
                    {/*    <Text children={`Адрес`}*/}
                    {/*          style={style.drawerText}/>*/}
                    {/*</TouchableOpacity>*/}

                    <TouchableOpacity style={style.drawerItem}
                                      onPress={() => {
                                          props.navigation.navigate(`SettingsScreen`);
                                      }}>
                        <Icon size={28}
                              color={`gray`}
                              source={`cog-outline`}/>
                        <Text children={t("DRAWER_MENU.SETTINGS")}
                              style={style.drawerText}/>
                    </TouchableOpacity>
                </View>

                {/*<Divider style={{*/}
                {/*    width: 0,*/}
                {/*    marginVertical: 44*/}
                {/*}}/>*/}

                {/*<Divider style={{*/}
                {/*    backgroundColor: `gray`,*/}
                {/*    marginHorizontal: 24,*/}
                {/*    marginVertical: 20*/}
                {/*}}/>*/}

                {/*<View style={style.drawerSection}>*/}

                {/*    <TouchableOpacity style={style.drawerItem}*/}
                {/*                      onPress={() => {*/}
                {/*                          props.navigation.navigate(`SettingsScreen`);*/}
                {/*                      }}>*/}
                {/*        <Icon size={28}*/}
                {/*              color={`gray`}*/}
                {/*              source={`cog-outline`}/>*/}
                {/*        <Text children={t("DRAWER_MENU.SETTINGS")}*/}
                {/*              style={style.drawerText}/>*/}
                {/*    </TouchableOpacity>*/}


                {/*    /!*<TouchableOpacity style={style.drawerItem}*!/*/}
                {/*    /!*                  onPress={() => {*!/*/}
                {/*    /!*                      props.navigation.navigate(`HomeScreen`);*!/*/}
                {/*    /!*                  }}>*!/*/}
                {/*    /!*    <Icon size={28}*!/*/}
                {/*    /!*          color={`#EE7100`}*!/*/}
                {/*    /!*          source={`magnify`}/>*!/*/}
                {/*    /!*    <Text children={`Поиск`}*!/*/}
                {/*    /!*          style={style.drawerText}/>*!/*/}
                {/*    /!*</TouchableOpacity>*!/*/}
                {/*</View>*/}
            </DrawerContentScrollView>

    )
});

const style = StyleSheet.create({
    drawer: {
        flex: 1,
        // backgroundColor: Colors.lighter,
        paddingTop: 13
    },
    drawerSection: {
        paddingLeft: 22,
        paddingTop: 12,
        gap: 24
    },
    drawerItem: {
        flexDirection: `row`,
        alignItems: `center`,
        gap: 14
    },
    drawerText: {
        fontSize: 14,
        fontWeight: `700`
    }
});
