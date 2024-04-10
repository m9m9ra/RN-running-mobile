import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {observer} from "mobx-react-lite"
import {Appbar, Icon, Text} from "react-native-paper";
import {DrawerHeaderProps, DrawerScreenProps} from "@react-navigation/drawer";
import {useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {MainStackParamList} from "../../../core/navigation/MainStack";
import {useRootStore} from "../shared/store/RootStore";
import {Activity} from "../../domain/entity/Activity";
import {Colors} from "react-native/Libraries/NewAppScreen";

// @ts-ignore
type props = DrawerScreenProps<MainStackParamList, `PedometerScreen`>;
export const PedometerScreen = observer(({navigation, route}: props) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {userStore} = useRootStore();
    const {t} = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (props: DrawerHeaderProps) => {

                return (
                        <Appbar.Header elevated
                                       style={{
                                           paddingRight: 12,
                                           paddingLeft: 16,
                                           backgroundColor: Colors.lighter,
                                           justifyContent: `space-between`
                                       }}>
                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  navigation.goBack();
                                              }}
                                              children={<Icon size={24}
                                                              source={"arrow-left"}/>}/>
                            {/* <Badge children={3}/> */}
                            <Appbar.Header mode={`small`}
                                           children={<Text children={`${t("DRAWER_MENU.PEDOMETER")}`}
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
                                              children={<Icon size={26}
                                                              source={"dots-vertical"}/>}/>
                        </Appbar.Header>
                )
            }
        })
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

                {userStore.user.activity.map((item: Activity, index: number) => {
                    return (
                            <TouchableWithoutFeedback disabled={false}
                                                      key={item.id}>
                                <View style={style.card}>
                                    <View style={{
                                        flexDirection: `row`,
                                        alignItems: `center`,
                                        gap: 16
                                    }}>
                                        <Image source={require(`./../../../../assets/image/footprints.png`)}
                                               style={{
                                                   width: 34,
                                                   height: 34
                                               }}/>
                                        <View>
                                            <View style={{
                                                flexDirection: `row`,
                                                alignItems: `center`,
                                                gap: 10
                                            }}>
                                                <Text children={`${t(`TOTAL_STEP`)}:`}
                                                      style={{
                                                          color: `gray`,
                                                          fontSize: 18,
                                                          fontWeight: `700`,
                                                          letterSpacing: 2.8
                                                      }}/>
                                                <Text children={`${item.step}`}
                                                      style={{
                                                          fontSize: 22,
                                                          fontWeight: `700`,
                                                          letterSpacing: 2.4
                                                      }}/>
                                            </View>
                                            <Text children={`${item.data}`}
                                                  style={{
                                                      color: `gray`,
                                                      fontSize: 14,
                                                      fontWeight: `700`,
                                                      letterSpacing: 2.8
                                                  }}/>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                    )
                })}
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
    }
});