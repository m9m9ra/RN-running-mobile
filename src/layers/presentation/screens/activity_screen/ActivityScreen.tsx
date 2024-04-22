import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../../../core/navigation/modules/HomeStack";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useRootStore} from "../../shared/store/RootStore";
import {useLayoutEffect, useState} from "react";
import {useNetInfo} from "@react-native-community/netinfo";
import {requestLocationPermission} from "../../../../core/utils/requestLocationPermission";
import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Appbar, Button, Dialog, Icon, MD3Colors, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {promptForEnableLocationIfNeeded} from "react-native-android-location-enabler";
import {MapMini} from "../../shared/ui/MapMini";
import CircularProgress from "react-native-circular-progress-indicator";
import {openSettings} from "react-native-permissions";

type props = BottomTabScreenProps<HomeStackParamList, `ActivityScreen`>;
export const ActivityScreen = observer(({navigation, route}: props) => {
    const {t} = useTranslation();
    const {timer, toggleRunning} = useRootStore();
    const {training, isRunning, runningStore} = useRootStore();
    const [permission, setPermission] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {type, isConnected} = useNetInfo();

    const [countdown, setCountdown] = useState<number>(10);
    const [countdownAvailible, setCountdownAvailible] = useState<boolean>(false);

    const [runningPause, setRunningPause] = useState<boolean>(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const togleRunning = async () => {
        const gpsPermission = await requestLocationPermission();
        setPermission(gpsPermission);

        console.log(runningStore.isRunning, gpsPermission);

        if (!runningStore.isRunning && !gpsPermission) {

        } else if (!runningStore.isRunning && gpsPermission) {
            setCountdownAvailible(true);
            const reverseTimer: NodeJS.Timeout = setInterval(() => {
                setCountdown((prevSequence) => prevSequence - 1);
            }, 1000);

            setTimeout(() => {
                setRefreshing(true);
                clearInterval(reverseTimer);
                setCountdownAvailible(false);
                runningStore.toggleRunning()
                        .then(() => {
                            setRefreshing(false);
                            setCountdown(10);
                        })
            }, 10000);
        } else if (runningStore.isRunning && !runningStore.isRunningPause) {
            setRunningPause(true);
            return
        } else {
            setRefreshing(true);
            runningStore.toggleRunning()
                    .then((running) => {
                        setRefreshing(false);
                        if (!running) {
                            setCountdown(10);
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
                                   height: 190
                               }}>

                    <View style={{
                        flexDirection: `row`,
                        justifyContent: `space-between`,
                        marginTop: 24,
                        width: `100%`
                    }}>
                        <View>

                        </View>
                        <View style={{
                            alignItems: `center`,
                            paddingLeft: 18,
                        }}>
                            <Text disabled={false}
                                  children={`${runningStore.timer}`}
                                  style={style.headerText}/>
                            <Text children={t(`ACTION.DURATION`)}
                                  style={style.headerLabel}/>
                        </View>
                        <View style={{
                            paddingTop: 14,
                            flexDirection: `row`,
                            alignItems: `flex-start`,
                            paddingRight: runningStore.isRunningPause ? 0 : 24,
                            gap: 4
                        }}>
                            <TouchableOpacity disabled={false}
                                              onPress={async () => {
                                                  await promptForEnableLocationIfNeeded()
                                              }}
                                              children={<Text children={`GPS`}
                                                              style={{
                                                                  ...style.headerText,
                                                                  paddingTop: 6,
                                                                  fontSize: 13,
                                                                  color: runningStore.gpsEnable ? `green` : MD3Colors.error30
                                                              }}/>}/>
                            {runningStore.isRunningPause
                                    ?
                                    <View style={{
                                        position: `relative`,
                                        top: 5
                                    }}>
                                        <Icon size={20}
                                              source={`pause`}
                                              color={`black`}/>
                                    </View>
                                    :
                                    false
                            }
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

                        <View style={{
                            alignItems: `center`
                        }}>
                            <Text children={`${// @ts-ignore
                                    runningStore.training && runningStore.training.kcal !== Infinity && runningStore.training.kcal !== null
                                            ?
                                            runningStore.training.kcal
                                            :
                                            `0`}`}
                                  style={style.headerScore}/>
                            <Text children={t(`ACTION.CALORIES`)}
                                  style={style.headerLabel}/>
                        </View>

                        <View>
                            <Text children={`${// @ts-ignore
                                    runningStore.training && runningStore.training.average_pace !== Infinity && runningStore.training.average_pace !== null
                                            ? runningStore.training.average_pace
                                            :
                                            `00:00`}`}
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

                {countdownAvailible ?
                        <View style={{
                            zIndex: 9999,
                            position: `absolute`,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            top: 190,
                            alignItems: `center`,
                            justifyContent: `center`,
                            backgroundColor: `#0000008B`
                        }}>
                            <CircularProgress value={countdown}
                                              radius={56}
                                              title={`${countdown}`}
                                              titleColor={`#ffffff`}
                                              titleFontSize={38}
                                              titleStyle={{
                                                  fontWeight: `700`
                                              }}

                                              showProgressValue={false}
                                              maxValue={10}
                                              clockwise={false}
                                              inActiveStrokeOpacity={0.5}
                                              activeStrokeWidth={15}
                                              strokeLinecap={`butt`}
                                              inActiveStrokeWidth={20}
                                              progressValueStyle={{fontWeight: '100', color: 'white'}}
                                              activeStrokeSecondaryColor="yellow"
                                              inActiveStrokeColor="black"
                                              duration={1000}
                                              delay={10}
                                              dashedStrokeConfig={{
                                                  count: 50,
                                                  width: 4,
                                              }}/>
                        </View>
                        :
                        false
                }

                {runningPause ?
                        <TouchableWithoutFeedback disabled={false}
                                                  onPress={() => {
                                                      setRunningPause(false);
                                                  }}>
                            <View style={{
                                zIndex: 9999,
                                position: `absolute`,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                top: 190,
                                alignItems: `center`,
                                justifyContent: `center`,
                                backgroundColor: `#0000008B`,
                                paddingBottom: 80
                            }}>
                                <View style={{
                                    backgroundColor: `#FFF`,
                                    borderRadius: 4,
                                    width: 180,
                                    height: 140,
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    gap: 24
                                }}>
                                    <View style={{
                                        flexDirection: `row`,
                                        alignItems: `center`,
                                        justifyContent: `space-between`,
                                        paddingHorizontal: 4
                                    }}>
                                        <Text children={``}/>
                                        <Icon size={24}
                                              source={`close-box-outline`}/>
                                    </View>
                                    <View style={{
                                        flexDirection: `row`,
                                        alignItems: `center`,
                                        justifyContent: `space-between`,
                                    }}>
                                        <TouchableOpacity disabled={false}
                                                          onPress={async () => {
                                                              if (runningStore.isRunning) {
                                                                  setRefreshing(true);
                                                                  setRunningPause(false);
                                                                  runningStore.toggleRunning()
                                                                          .then((running) => {
                                                                              setRefreshing(false);
                                                                              if (!running) {
                                                                                  setCountdown(10);
                                                                                  // @ts-ignore
                                                                                  navigation.navigate(`AboutTrainingStack`, {training: runningStore.training})
                                                                              } else {
                                                                                  throw new Error(`??? Activity Screen`);
                                                                              }
                                                                          });
                                                              }
                                                          }}
                                                          style={{
                                                              width: 58,
                                                              height: 58,
                                                              backgroundColor: `#FFF`,
                                                              borderRadius: 4,
                                                              alignItems: `center`,
                                                              justifyContent: `center`,
                                                              elevation: 4
                                                          }}
                                                          children={<Icon size={24}
                                                                          source={`stop`}/>}/>

                                        <TouchableOpacity disabled={false}
                                                          onPress={async () => {
                                                              await runningStore.pauseRunning();
                                                              setRunningPause(false);
                                                          }}
                                                          style={{
                                                              width: 58,
                                                              height: 58,
                                                              backgroundColor: `#FFF`,
                                                              borderRadius: 4,
                                                              alignItems: `center`,
                                                              justifyContent: `center`,
                                                              elevation: 4
                                                          }}
                                                          children={<Icon size={24}
                                                                          source={`pause`}/>}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        :
                        false
                }

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
                            openSettings().then(r => {
                            });
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
                                                      children={`${runningStore.isRunning && !runningStore.isRunningPause ? t(`ACTION.END_TIMER`) : t(`ACTION.START_TIMER`)}`.toUpperCase()}
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
        fontSize: 36,
        fontWeight: `700`,
        letterSpacing: -0.4
    },
    headerScore: {
        fontSize: 28,
        fontWeight: `700`,
        letterSpacing: -0.6
    },
    headerLabel: {}
});