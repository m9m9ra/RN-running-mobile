import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {BottomTabHeaderProps, BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../../../core/navigation/modules/HomeStack";
import {observer} from "mobx-react-lite";
import {useLayoutEffect, useState} from "react";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {useRootStore} from "../shared/store/RootStore";
import {Training} from "../../domain/entity/Training";
import {useTranslation} from "react-i18next";
import {Appbar, Avatar, Divider, Icon, MD3LightTheme, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {daysInMonth} from "../../../core/utils/DayInMonth";
import moment from "moment";
import {TotalStep} from "../shared/ui/TotalStep";
import {colorSchema} from "../../../core/utils/ColorSchema";


type props = BottomTabScreenProps<HomeStackParamList, `ProgressStack`>;

export const HomeScreen = observer(({navigation, route}: props) => {
    const [data, setData] = useState<Array<number>>([]);
    const [selectedDay, setSelectedDay] = useState<number>(26);
    const [refreshing, setRefreshing] = useState<boolean>(true);
    const navigationState = useNavigation();
    const {stepCounter, userStore, training, geolocationService, settingStore} = useRootStore();
    const [filter, setFilter] = useState<string>(``);
    const [sortedTraining, setSortedTraining] = useState<Training[]>(userStore.user.training ? userStore.user.training : []);
    const [sortedTrainingCount, setSortedTrainingCount] = useState<number>(4);
    const {t} = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (props: BottomTabHeaderProps) => {
                return (
                        <Appbar.Header elevated
                                       style={{
                                           paddingHorizontal: 24,
                                           backgroundColor: settingStore.them == "DARK" ? Colors.darker : Colors.lighter
                                       }}>
                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  navigationState.dispatch(DrawerActions.openDrawer);
                                              }}
                                              children={<Icon size={28}
                                                              source={"menu"}/>}/>
                            {/* <Badge children={3}/> */}
                            <Appbar.Header mode={`small`}
                                           children={<Text children={t(`DRAWER_MENU.PROGRESS`)}
                                                           style={{
                                                               width: `73%`,
                                                               fontWeight: `700`,
                                                               letterSpacing: 1,
                                                               textAlign: `center`
                                                           }}/>}
                                           style={{
                                               backgroundColor: settingStore.them == "DARK" ? Colors.darker : Colors.lighter
                                           }}/>
                            <View style={{
                                flexDirection: `row`,
                                alignItems: `center`,
                                gap: 14
                            }}>
                                {userStore.isNotRemoteTrainingStatus
                                        ?
                                        <TouchableOpacity disabled={false}
                                                          onPress={async () => {
                                                              setRefreshing(true);
                                                              userStore.uploadLocalTraining()
                                                                      .then(() => {
                                                                          setRefreshing(false);
                                                                      });
                                                          }}
                                                          children={<Icon size={24}
                                                                          source={`cloud-upload-outline`}/>}/>
                                        :
                                        <View style={{
                                            width: 24
                                        }}/>
                                }
                                <Avatar.Text label="M9"
                                             style={{
                                                 backgroundColor: `#A7A7A7`
                                             }}
                                             size={34}/>
                            </View>
                        </Appbar.Header>
                )
            }
        });

        if (data.length < 27) {
            let dataToArr = Number(daysInMonth());
            while (dataToArr > 0) {
                data.push(dataToArr);

                dataToArr -= 1;
            }
        }

        setTimeout(() => {
            setRefreshing(false);
        }, 1240);
    }, []);
    const renderItem = (item: any, index: number) => {
        return (
                <TouchableOpacity disabled={false}
                                  style={{
                                      // height: 24,
                                      minWidth: 42,
                                      maxWidth: 44,
                                      backgroundColor: index == selectedDay || index == Number(moment(new Date(), "DD")) ? MD3LightTheme.colors.primaryContainer : `#FFFFFF`,
                                      paddingHorizontal: 4,
                                      paddingVertical: 8,
                                      gap: 2,
                                      borderRadius: 12,
                                      borderWidth: 1,
                                      borderColor: `gray`
                                  }}
                                  onPress={() => {
                                      setSelectedDay(index);
                                  }}
                                  children={<View style={{
                                      alignItems: `center`,
                                      justifyContent: `center`
                                  }}>
                                      <Text children={`Thu`}/>
                                      <Text children={item}
                                            style={{
                                                borderRadius: 15,
                                                padding: 8,
                                                fontSize: 14,
                                                fontWeight: `700`,
                                                backgroundColor: "#FFFFFF",
                                                color: `black`,
                                            }}/>
                                  </View>}/>
        )
    }

    const onRefresh = () => {
        setRefreshing(true);
        userStore.updateUserInfo()
                .then(() => {
                    setRefreshing(false);
                })
    };

    return (
            <ScrollView horizontal={false}
                        nestedScrollEnabled={false}
                        refreshControl={<RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}
                        contentContainerStyle={{
                            ...style.container,
                            backgroundColor: settingStore.them == "DARK" ? Colors.darker : Colors.lighter
                        }}>

                <View style={{
                    marginBottom: 24
                }}>
                    <Text children={`${moment().format("MMMM DD")}, ${moment().format("YYYY")}`}
                          style={{
                              fontSize: 14,
                              fontWeight: `700`,
                              color: `gray`
                          }}/>
                    <Text children={`${t(`GREETINGS`)} ${userStore.user.firstName}`}
                          style={{
                              fontSize: 22,
                              fontWeight: `700`
                          }}/>
                </View>

                <View style={{
                    paddingVertical: 0,
                    gap: 6
                }}>

                    <Text children={`${t("PROGRESS.DAY_ACTIVITY")}`.toUpperCase()}
                          style={{
                              fontSize: 17,
                              fontWeight: `700`,
                              letterSpacing: 2.4
                          }}/>

                    <TouchableWithoutFeedback disabled={false}
                                              onPress={() => {
                                                  // @ts-ignore
                                                  navigation.navigate(`PedometerScreen`);
                                              }}
                                              children={<TotalStep useStore={true}/>}/>
                </View>

                <View style={{
                    paddingVertical: 34,
                    gap: 18
                }}>
                    {/*<Text children={`ACTIVITY STREAK`}*/}
                    {/*      style={{*/}
                    {/*          fontSize: 18,*/}
                    {/*          fontWeight: `700`,*/}
                    {/*          letterSpacing: 2.4*/}
                    {/*      }}/>*/}

                    <View>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            justifyContent: `space-between`,
                            marginBottom: 8
                        }}>
                            <Text children={`${t("PROGRESS.ACTIVITY_STREAK")}`.toUpperCase()}
                                  style={{
                                      fontSize: 17,
                                      fontWeight: `700`,
                                      letterSpacing: 2.4
                                  }}/>

                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  // @ts-ignore
                                                  navigation.navigate(`HistoryScreen`);
                                              }}
                                              children={<Text children={`Show more`}
                                                              style={{
                                                                  fontSize: 14,
                                                                  fontWeight: `600`,
                                                                  color: MD3LightTheme.colors.primary,
                                                                  letterSpacing: 1,
                                                                  textDecorationLine: `underline`
                                                              }}/>}/>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        gap: 12
                    }}>
                        <Icon size={44}
                              source={`lightning-bolt-outline`}/>
                        <View>
                            <View style={{
                                flexDirection: `row`,
                                alignItems: `center`,
                                justifyContent: `flex-end`,
                                gap: 4
                            }}>
                                <Text children={`${userStore.user.training.length}`}
                                      style={{
                                          fontSize: 24,
                                          fontWeight: `700`,
                                          letterSpacing: 2.4
                                      }}/>
                                <Text children={`${t("PROGRESS.ACTIVITY")}`.toLowerCase()}
                                      style={{
                                          fontSize: 16,
                                          fontWeight: `700`,
                                          letterSpacing: 2.4,
                                          textAlignVertical: `bottom`,
                                          textAlign: `left`
                                      }}/>
                            </View>
                            <Text children={`${t("PROGRESS.TOTAL_STREAK")}`.toLowerCase()}
                                  style={{}}/>
                        </View>
                    </View>
                </View>

                <View style={{
                    gap: 12,
                    marginTop: 12
                }}>
                    <View>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            justifyContent: `space-between`,
                            marginBottom: 10
                        }}>
                            <Text children={`${t("PROGRESS.RECENT_ACTIVITY")}`.toUpperCase()}
                                  style={{
                                      fontSize: 17,
                                      fontWeight: `700`,
                                      letterSpacing: 2.4
                                  }}/>

                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  // @ts-ignore
                                                  navigation.navigate(`HistoryScreen`);
                                              }}
                                              children={<Text children={`Show more`}
                                                              style={{
                                                                  fontSize: 14,
                                                                  fontWeight: `600`,
                                                                  color: MD3LightTheme.colors.primary,
                                                                  letterSpacing: 1,
                                                                  textDecorationLine: `underline`
                                                              }}/>}/>
                        </View>
                    </View>

                    {userStore.user.training.slice(0, sortedTrainingCount).map((item: Training, index: number) => {
                        return (
                                <TouchableWithoutFeedback key={item.id}
                                                          onPress={() => {
                                                              // @ts-ignore
                                                              navigation.navigate(`AboutTrainingStack`, {training: item});
                                                          }}>
                                    <View style={{
                                        elevation: 2,
                                        borderRadius: 2,
                                        backgroundColor: `#FFFFFF`,
                                        height: 78,
                                        flexDirection: `row`,
                                    }}>
                                        <View style={{
                                            width: 60,
                                            borderRadius: 2,
                                            alignItems: `flex-end`,
                                            justifyContent: `center`
                                        }}>
                                            <Icon size={48}
                                                  color={`gray`}
                                                  source={`run-fast`}/>
                                        </View>

                                        <Divider style={{
                                            width: 14
                                        }}/>

                                        <View style={{
                                            paddingVertical: 4,
                                            flex: 1,
                                            flexDirection: `row`,
                                            // alignItems: `center`,
                                            justifyContent: `space-between`,
                                            paddingRight: 10,
                                            // gap: 4
                                        }}>
                                            <View>
                                                <Text children={`${item.data}: ${item.start_data}`}
                                                      style={{
                                                          fontSize: 16,
                                                          fontWeight: `700`
                                                      }}/>
                                                <Text children={`${item.distance == null ? `0.00` : item.distance.slice(0, 4)} km`}
                                                      style={{
                                                          fontSize: 18,
                                                          fontWeight: `700`
                                                      }}/>
                                                <View style={{
                                                    flexDirection: `row`,
                                                    alignItems: `center`,
                                                    justifyContent: `space-between`
                                                }}>
                                                    <Text children={`${t(`TOTAL_STEP`)}: ${item.step_count == null ? `0` : item.step_count}`}/>
                                                    <Text children={`Kcal: ${item.step_count == null ? `0` : item.step_count}`}/>
                                                    <Text children={`${item.duration == null ? `0.00` : item.duration}`}/>
                                                </View>
                                            </View>

                                            <View style={{
                                                alignItems: `center`,
                                                justifyContent: `center`
                                            }}>
                                                <TouchableOpacity disabled={false}
                                                                  onPress={() => {
                                                                      // @ts-ignore
                                                                      navigation.navigate(`AboutTrainingStack`, {training: item});
                                                                  }}
                                                                  children={<Icon size={32}
                                                                                  color={colorSchema.primary}
                                                                                  source={`chevron-right`}/>}/>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                        )
                    })}

                    {/*{sortedTrainingCount < userStore.user.training.length*/}
                    {/*        ?*/}
                    {/*        <TouchableOpacity disabled={false}*/}
                    {/*                          onPress={() => {*/}
                    {/*                              setRefreshing(true);*/}
                    {/*                              setSortedTrainingCount(sortedTrainingCount + 7);*/}
                    {/*                              setTimeout(() => {*/}
                    {/*                                  setRefreshing(false);*/}
                    {/*                              }, 250);*/}
                    {/*                          }}*/}
                    {/*                          style={{*/}
                    {/*                              alignItems: `center`,*/}
                    {/*                              justifyContent: `center`,*/}
                    {/*                              marginTop: 4*/}
                    {/*                          }}*/}
                    {/*                          children={<Text children={`Load more`}*/}
                    {/*                                          style={{*/}
                    {/*                                              fontSize: 16,*/}
                    {/*                                              color: MD3LightTheme.colors.primary*/}
                    {/*                                          }}/>}/>*/}
                    {/*        :*/}
                    {/*        false*/}
                    {/*}*/}
                </View>

            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24
    }
});