import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../../../core/navigation/modules/HomeStack";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useRootStore} from "../../shared/store/RootStore";
import {useLayoutEffect, useState} from "react";
import {requestLocationPermission} from "../../../../core/utils/requestLocationPermission";
import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Appbar, Button, Dialog, Icon, MD3Colors, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {promptForEnableLocationIfNeeded} from "react-native-android-location-enabler";
import CircularProgress from "react-native-circular-progress-indicator";
import {openSettings} from "react-native-permissions";
import SwipeButton from 'rn-swipe-button';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {ActivityMapTab} from "./tabs/ActivityMapTab";
import {ActivitySettingsTab} from "./tabs/ActivitySettingsTab";
import {ActivityMusicTab} from "./tabs/ActivityMusicTab";
import {ActivityProgressTab} from "./tabs/ActivityProgressTab";
import {colorSchema} from "../../../../core/utils/ColorSchema";
import {MapMini} from "./ui/MapMini";

export type ActivityScreenParamList = {
    ActivityMusicTab: any,
    ActivityMapTab: any,
    ActivityProgressTab: any,
    ActivitySettingsTab: any
}

const Tabs = createMaterialTopTabNavigator<ActivityScreenParamList>();
type props = BottomTabScreenProps<HomeStackParamList, `ActivityScreen`>;
export const ActivityScreen = observer(({navigation, route}: props) => {
    const {t} = useTranslation();
    const {training, isRunning, runningStore} = useRootStore();
    const [permission, setPermission] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

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
                            <Text children={`${runningStore.training && runningStore.training.distance && runningStore.isRunning ? runningStore.training.distance : `0.00`}`}
                                  style={style.headerScore}/>
                            <Text children={t(`ACTION.DISTANCE`)}
                                  style={style.headerLabel}/>
                        </View>

                        <View style={{
                            alignItems: `center`
                        }}>
                            <Text children={`${// @ts-ignore
                                    runningStore.training && runningStore.training.kcal !== Infinity && runningStore.training.kcal !== null && runningStore.isRunning
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
                                    runningStore.training && runningStore.training.average_pace !== Infinity && runningStore.training.average_pace !== null && runningStore.isRunning
                                            ? runningStore.training.average_pace
                                            :
                                            `00:00`}`}
                                  style={style.headerScore}/>
                            <Text children={t(`ACTION.AVERAGE`)}
                                  style={style.headerLabel}/>
                        </View>

                    </View>
                </Appbar.Header>

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

                {runningStore.isRunning ?
                        <Tabs.Navigator initialRouteName={`ActivityMapTab`}
                                        screenOptions={{
                                            tabBarStyle: {
                                                height: 50,
                                                backgroundColor: Colors.lighter,
                                            },
                                            tabBarIndicatorStyle: {
                                                backgroundColor: colorSchema.secondary,
                                                height: 3
                                            },
                                            swipeEnabled: false,
                                            tabBarScrollEnabled: false,
                                            animationEnabled: false
                                        }}>
                            <Tabs.Screen name={`ActivityMusicTab`}
                                         options={{
                                             tabBarShowLabel: false,
                                             tabBarIcon: () => {
                                                 return (
                                                         <Icon size={28}
                                                               source={`music-box-outline`}/>
                                                 )
                                             }
                                         }}
                                         component={ActivityMusicTab}/>

                            <Tabs.Screen name={`ActivityMapTab`}
                                         options={{
                                             tabBarShowLabel: false,
                                             tabBarIcon: () => {
                                                 return (
                                                         <Icon size={28}
                                                               source={`map-outline`}/>
                                                 )
                                             }
                                         }}
                                         component={ActivityMapTab}/>

                            <Tabs.Screen name={`ActivityProgressTab`}
                                         options={{
                                             tabBarShowLabel: false,
                                             tabBarIcon: () => {
                                                 return (
                                                         <Icon size={28}
                                                               source={`chart-box-outline`}/>
                                                 )
                                             }
                                         }}
                                         component={ActivityProgressTab}/>

                            <Tabs.Screen name={`ActivitySettingsTab`}
                                         options={{
                                             tabBarShowLabel: false,
                                             tabBarIcon: () => {
                                                 return (
                                                         <Icon size={28}
                                                               source={`cog-outline`}/>
                                                 )
                                             }
                                         }}
                                         component={ActivitySettingsTab}/>

                        </Tabs.Navigator>
                        :
                        <MapMini/>
                }

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

                {/*{runningPause ?*/}
                {/*        <TouchableWithoutFeedback disabled={false}*/}
                {/*                                  onPress={() => {*/}
                {/*                                      setRunningPause(false);*/}
                {/*                                  }}>*/}
                {/*            <View style={{*/}
                {/*                zIndex: 9999,*/}
                {/*                position: `absolute`,*/}
                {/*                left: 0,*/}
                {/*                right: 0,*/}
                {/*                bottom: 0,*/}
                {/*                top: 190,*/}
                {/*                alignItems: `center`,*/}
                {/*                justifyContent: `center`,*/}
                {/*                backgroundColor: `#0000008B`,*/}
                {/*                paddingBottom: 80*/}
                {/*            }}>*/}
                {/*                <View style={{*/}
                {/*                    backgroundColor: `#FFF`,*/}
                {/*                    borderRadius: 4,*/}
                {/*                    width: 180,*/}
                {/*                    height: 140,*/}
                {/*                    paddingHorizontal: 16,*/}
                {/*                    paddingVertical: 12,*/}
                {/*                    gap: 24*/}
                {/*                }}>*/}
                {/*                    <View style={{*/}
                {/*                        flexDirection: `row`,*/}
                {/*                        alignItems: `center`,*/}
                {/*                        justifyContent: `space-between`,*/}
                {/*                        paddingHorizontal: 4*/}
                {/*                    }}>*/}
                {/*                        <Text children={``}/>*/}
                {/*                        <Icon size={24}*/}
                {/*                              source={`close-box-outline`}/>*/}
                {/*                    </View>*/}
                {/*                    <View style={{*/}
                {/*                        flexDirection: `row`,*/}
                {/*                        alignItems: `center`,*/}
                {/*                        justifyContent: `space-between`,*/}
                {/*                    }}>*/}
                {/*                        <TouchableOpacity disabled={false}*/}
                {/*                                          onPress={async () => {*/}
                {/*                                              if (runningStore.isRunning) {*/}
                {/*                                                  setRefreshing(true);*/}
                {/*                                                  setRunningPause(false);*/}
                {/*                                                  runningStore.toggleRunning()*/}
                {/*                                                          .then((running) => {*/}
                {/*                                                              setRefreshing(false);*/}
                {/*                                                              if (!running) {*/}
                {/*                                                                  setCountdown(10);*/}
                {/*                                                                  // @ts-ignore*/}
                {/*                                                                  navigation.navigate(`AboutTrainingStack`, {training: runningStore.training})*/}
                {/*                                                              } else {*/}
                {/*                                                                  throw new Error(`??? Activity Screen`);*/}
                {/*                                                              }*/}
                {/*                                                          });*/}
                {/*                                              }*/}
                {/*                                          }}*/}
                {/*                                          style={{*/}
                {/*                                              width: 58,*/}
                {/*                                              height: 58,*/}
                {/*                                              backgroundColor: `#FFF`,*/}
                {/*                                              borderRadius: 4,*/}
                {/*                                              alignItems: `center`,*/}
                {/*                                              justifyContent: `center`,*/}
                {/*                                              elevation: 4*/}
                {/*                                          }}*/}
                {/*                                          children={<Icon size={24}*/}
                {/*                                                          source={`stop`}/>}/>*/}

                {/*                        <TouchableOpacity disabled={false}*/}
                {/*                                          onPress={async () => {*/}
                {/*                                              await runningStore.pauseRunning();*/}
                {/*                                              setRunningPause(false);*/}
                {/*                                          }}*/}
                {/*                                          style={{*/}
                {/*                                              width: 58,*/}
                {/*                                              height: 58,*/}
                {/*                                              backgroundColor: `#FFF`,*/}
                {/*                                              borderRadius: 4,*/}
                {/*                                              alignItems: `center`,*/}
                {/*                                              justifyContent: `center`,*/}
                {/*                                              elevation: 4*/}
                {/*                                          }}*/}
                {/*                                          children={<Icon size={24}*/}
                {/*                                                          source={`pause`}/>}/>*/}
                {/*                    </View>*/}
                {/*                </View>*/}
                {/*            </View>*/}
                {/*        </TouchableWithoutFeedback>*/}
                {/*        :*/}
                {/*        false*/}
                {/*}*/}

                <View style={{
                    paddingHorizontal: 24,
                    position: `absolute`,
                    bottom: 24,
                    left: 0,
                    right: 0
                }}>
                    {runningStore.isRunning ?
                            runningPause ?
                                    <View style={{
                                        flexDirection: `row`,
                                        alignItems: `center`,
                                        justifyContent: `space-between`,
                                        gap: 12
                                    }}>
                                        <TouchableOpacity disabled={refreshing}
                                                          onPress={async () => {
                                                              if (runningStore.isRunning) {
                                                                  setRefreshing(true);
                                                                  setRunningPause(false);
                                                                  runningStore.toggleRunning()
                                                                          .then(() => {
                                                                              runningStore.toggleRunning().then((running) => {
                                                                                  setRefreshing(false);
                                                                                  if (!running) {
                                                                                      setCountdown(10);
                                                                                      navigation.navigate(`ProgressStack`, {
                                                                                          // @ts-ignore
                                                                                          screen: "AboutTrainingStack",
                                                                                          params: {
                                                                                              training: runningStore.training
                                                                                          }
                                                                                      })
                                                                                  } else {
                                                                                      throw new Error(`??? Activity Screen`);
                                                                                  }
                                                                              })
                                                                          });
                                                              }
                                                          }}
                                                          style={{
                                                              backgroundColor: `#FFFFFF`,
                                                              paddingHorizontal: 11,
                                                              paddingVertical: 16,
                                                              flexDirection: `row`,
                                                              justifyContent: `center`,
                                                              elevation: 4,
                                                              flex: 1,
                                                              borderRadius: 0,
                                                              borderWidth: 1,
                                                              borderColor: `black`
                                                          }}
                                                          children={<Text children={`finish`.toUpperCase()}
                                                                          style={{
                                                                              color: `black`,
                                                                              fontSize: 13,
                                                                              letterSpacing: 2.6,
                                                                              fontWeight: `700`
                                                                          }}/>}/>

                                        <TouchableOpacity disabled={refreshing}
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

                                                                              }
                                                                          });
                                                              }
                                                          }}
                                                          style={{
                                                              backgroundColor: `black`,
                                                              paddingHorizontal: 11,
                                                              paddingVertical: 16,
                                                              flexDirection: `row`,
                                                              justifyContent: `center`,
                                                              elevation: 4,
                                                              flex: 1
                                                          }}
                                                          children={<Text children={`resume`.toUpperCase()}
                                                                          style={{
                                                                              color: `#FFFFFF`,
                                                                              fontSize: 13,
                                                                              letterSpacing: 2.6,
                                                                              fontWeight: `700`
                                                                          }}/>}/>
                                    </View>
                                    :
                                    <SwipeButton disabled={refreshing}
                                                 onSwipeSuccess={async () => {
                                                     console.log(`success stop running!`);
                                                     setRunningPause(true);
                                                     setRefreshing(true);
                                                     await runningStore.pauseRunning();
                                                     setRefreshing(false);
                                                 }}
                                                 title={`Slide to pause ⟶`.toUpperCase()}
                                                 resetAfterSuccessAnimDelay={150}
                                                 screenReaderEnabled={false}
                                                 swipeSuccessThreshold={50}
                                                 railBackgroundColor="black"
                                                 railStyles={{
                                                     backgroundColor: `rgba(255, 255, 255, 0.45)`,
                                                     borderWidth: 0,
                                                     borderRadius: 0
                                                 }}
                                                 thumbIconBackgroundColor={`rgba(255, 255, 255, 0)`}
                                                 thumbIconStyles={{
                                                     backgroundColor: `#FFFFFF`,
                                                     // display: `none`,
                                                     // width: 10,
                                                     // height: 10,
                                                     borderRadius: 0,
                                                     borderWidth: 0
                                                 }}
                                                 titleStyles={{
                                                     color: `#FFFFFF`,
                                                     fontSize: 13,
                                                     letterSpacing: 2.6,
                                                     fontWeight: `700`,
                                                     paddingHorizontal: 11,
                                                 }}
                                                 containerStyles={{
                                                     backgroundColor: `black`,
                                                     flexDirection: `row`,
                                                     justifyContent: `space-between`,
                                                     paddingVertical: 4,
                                                     borderRadius: 0,
                                                     elevation: 4
                                                 }}/>
                            :
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
                                                      children={<Icon size={18} source={`arrow-right`}
                                                                      color={`#FFFFFF`}/>}
                                                      onPress={async () => togleRunning()}/>
                                </View>
                            </TouchableWithoutFeedback>
                    }
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