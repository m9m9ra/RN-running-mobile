import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {useLayoutEffect, useState} from "react";
import {Appbar, Button, Dialog, Icon, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {HomeStackParamList} from "../../../core/navigation/modules/HomeStack";
import {useRootStore} from "../shared/store/RootStore";
import {MapMini} from "../shared/ui/MapMini";
import {requestLocationPermission} from "../../../core/utils/requestLocationPermission";
import {openSettings} from "react-native-permissions";
import {useNetInfo} from "@react-native-community/netinfo";

type props = BottomTabScreenProps<HomeStackParamList, `ActivityScreen`>;
export const ActivityScreen = observer(({navigation, route}: props) => {
    const {t} = useTranslation();
    const {timer, toggleRunning} = useRootStore();
    const {training, isRunning, runningStore} = useRootStore();
    const [permission, setPermission] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { type, isConnected } = useNetInfo();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const togleRunning = async () => {
        const gpsPermission = await requestLocationPermission();
        setPermission(gpsPermission);

        console.log(runningStore.isRunning, gpsPermission);

        if (!isRunning && !gpsPermission) {
        } else {
            setRefreshing(true);
            runningStore.toggleRunning()
                    .then((running) => {
                        setRefreshing(false);
                        if (!running) {
                            // @ts-ignore
                            navigation.navigate(`AboutTrainingStack`, {training: runningStore.training})
                        } else {
                        }
                    });
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 450)
    };

    return (
            <ScrollView horizontal={false}
                        refreshControl={<RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}
                        contentContainerStyle={style.container}>
                <Appbar.Header mode={`small`}
                               elevated
                               style={{
                                   backgroundColor: Colors.lighter,
                                   paddingHorizontal: 24,
                                   flexDirection: `column`,
                                   height: 186
                               }}>
                    {/*<View style={{*/}
                    {/*    width: `100%`,*/}
                    {/*    flexDirection: `row`,*/}
                    {/*    alignItems: `center`,*/}
                    {/*    justifyContent: `flex-end`*/}
                    {/*}}>*/}
                    {/*    <Icon size={24}*/}
                    {/*          source={`map-marker`}*/}
                    {/*          color={`green`}/>*/}
                    {/*</View>*/}

                    <View style={{
                        flexDirection: `row`,
                        justifyContent: `space-between`,
                        marginTop: 24,
                        width: `100%`
                    }}>
                        <View>

                        </View>
                        <View style={{
                            alignItems: `center`
                        }}>
                            <Text disabled={false}
                                  children={`${runningStore.timer}`}
                                  style={style.headerText}/>
                            <Text children={t(`ACTION.DURATION`)}
                                  style={style.headerLabel}/>
                        </View>
                        <View style={{
                            paddingTop: 14
                        }}>
                            {/*<Icon size={24}*/}
                            {/*      source={`map-marker`}*/}
                            {/*      color={`green`}/>*/}
                            <Icon size={24}
                                  source={`connection`}
                                  color={isConnected ? `green` : `red`}/>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        width: `100%`,
                        justifyContent: `space-between`,
                        marginTop: 24
                    }}>
                        <View>
                            <Text children={`${runningStore.training && runningStore.training.distance ? runningStore.training.distance : `0.00`}`}
                                  style={style.headerScore}/>
                            <Text children={t(`ACTION.DISTANCE`)}
                                  style={style.headerLabel}/>
                        </View>

                        <View>
                            <Text children={`${runningStore.training && runningStore.training.kcal ? runningStore.training.kcal : `0.00`}`}
                                  style={style.headerScore}/>
                            <Text children={t(`ACTION.CALORIES`)}
                                  style={style.headerLabel}/>
                        </View>

                        <View>
                            <Text children={`${runningStore.training && runningStore.training.average ? runningStore.training.average : `00:00`}`}
                                  style={style.headerScore}/>
                            <Text children={t(`ACTION.AVERAGE`)}
                                  style={style.headerLabel}/>
                        </View>

                    </View>
                </Appbar.Header>

                {!refreshing ?
                        <MapMini/>
                        :
                        false}

                <Dialog visible={!permission}
                        style={{
                            borderRadius: 4,
                            backgroundColor: `#FFF`
                        }}
                        onDismiss={() => {
                            setPermission(true);
                        }}>
                    <Dialog.Title children={`GPS location`}
                                  style={{
                                      letterSpacing: 1.6
                                  }}/>
                    <Dialog.Content>
                        <Text variant="bodyMedium"
                              children={`Prodman Running App needs access to your location always`}
                              style={{
                                  letterSpacing: 0.8
                              }}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setPermission(true);
                            openSettings().then(r => {});
                        }}
                                labelStyle={{
                                    letterSpacing: 0.8
                                }}
                                children={`Open settings`}/>
                    </Dialog.Actions>
                </Dialog>

                <View style={{
                    paddingHorizontal: 24,
                    position: `absolute`,
                    bottom: 24,
                    left: 0,
                    right: 0
                }}>
                    <TouchableWithoutFeedback disabled={refreshing}
                                              onPress={async () => togleRunning()}>
                        <View style={{
                            backgroundColor: `black`,
                            paddingHorizontal: 11,
                            paddingVertical: 16,
                            flexDirection: `row`,
                            justifyContent: `space-between`,
                            elevation: 4
                        }}>
                            <TouchableOpacity disabled={refreshing}
                                    //END_TIMER
                                              children={<Text
                                                      children={`${runningStore.isRunning ? t(`ACTION.END_TIMER`) : t(`ACTION.START_TIMER`)}`.toUpperCase()}
                                                      style={{
                                                          color: `#FFFFFF`,
                                                          fontSize: 13,
                                                          letterSpacing: 2.6,
                                                          fontWeight: `700`
                                                      }}/>}
                                              onPress={async () => togleRunning()}/>
                            <TouchableOpacity disabled={refreshing}
                                              children={<Icon size={18} source={`arrow-right`} color={`#FFFFFF`}/>}
                                              onPress={async () => togleRunning()}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: `space-between`
    },
    headerText: {
        fontSize: 34,
        fontWeight: `700`
    },
    headerScore: {
        fontSize: 28,
        fontWeight: `700`
    },
    headerLabel: {}
});