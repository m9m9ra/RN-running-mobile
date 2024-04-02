import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback, RefreshControl
} from "react-native";
import {Appbar, Avatar, Divider, Icon, MD3LightTheme, Text} from "react-native-paper";
import {observer} from "mobx-react-lite";
import {BottomTabHeaderProps, BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../navigation/modules/HomeStack";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {useLayoutEffect, useState} from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {LineChart} from "react-native-chart-kit";
import CircularProgress from "react-native-circular-progress-indicator";
import {daysInMonth} from "../utils/DayInMonth";
import {FlatList} from "react-native-gesture-handler";
import {FilterActivityScreen} from "../components/FilterActivityList";
import {useRootStore} from "../store/RootStore";
import {TotalStep} from "../components/TotalStep";
import moment from "moment/moment";
import {useTranslation} from "react-i18next";
import {Training} from "../entity/Training";
import {colorSchema} from "../utils/ColorSchema";
import YaMap, {Marker, Polyline} from "react-native-yamap";


type props = BottomTabScreenProps<HomeStackParamList, `HomeScreen`>;

export const HomeScreen = observer(({navigation, route}: props) => {
    const [data, setData] = useState<Array<number>>([]);
    const [selectedDay, setSelectedDay] = useState<number>(26);
    const [refreshing, setRefreshing] = useState<boolean>(true);
    const navigationState = useNavigation();
    const {stepCounter, userStore, training, geolocationService} = useRootStore();
    const {t} = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (props: BottomTabHeaderProps) => {

                return (
                        <Appbar.Header elevated
                                       style={{
                                           paddingHorizontal: 24,
                                           backgroundColor: Colors.lighter
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
                                                               width: `82%`,
                                                               fontWeight: `700`,
                                                               letterSpacing: 1,
                                                               textAlign: `center`
                                                           }}/>}
                                           style={{
                                               backgroundColor: Colors.lighter
                                           }}/>
                            <Avatar.Text label="M9"
                                         style={{
                                             backgroundColor: `#A7A7A7`
                                         }}
                                         size={34}/>
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
        };

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
                                      backgroundColor: index == selectedDay ? MD3LightTheme.colors.primaryContainer : `#FFFFFF`,
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
                        contentContainerStyle={style.container}>

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
                              fontSize: 24,
                              fontWeight: `700`
                          }}/>
                </View>

                <TotalStep useStore={true}/>

                <View>
                    <FlatList data={data}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{
                                  gap: 24,
                                  paddingVertical: 24
                              }}
                              pagingEnabled
                              renderItem={item => renderItem(item.item, item.index)}/>
                </View>

                <View>
                    <Text children={t(`MY_ACTIVITY`)}
                          style={{
                              fontSize: 24,
                              fontWeight: `700`,
                              letterSpacing: 2.4
                          }}/>
                    <LineChart data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                               width={Dimensions.get("window").width - 48} // from react-native
                               height={220}
                               yAxisLabel="$"
                               yAxisSuffix="k"
                               yAxisInterval={1} // optional, defaults to 1
                               chartConfig={{
                                   backgroundColor: "#A7A7A7",
                                   backgroundGradientFrom: "#A7A7A7",
                                   backgroundGradientTo: "#000000",
                                   decimalPlaces: 2, // optional, defaults to 2dp
                                   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                   labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                   style: {
                                       borderRadius: 4
                                   },
                                   propsForDots: {
                                       r: "6",
                                       strokeWidth: "2",
                                       stroke: "#ffa726"
                                   }
                               }}
                               bezier
                               style={{
                                   marginVertical: 8,
                                   borderRadius: 4
                               }}/>
                </View>

                <View style={{
                    marginTop: 12
                }}>
                    <FilterActivityScreen/>
                </View>

                <View style={{
                    gap: 12,
                    marginTop: 12
                }}>
                    {userStore.user.training.reverse().map((item: Training, index: number) => {
                        return (
                                <TouchableWithoutFeedback key={item.id}
                                                          onPress={() => {
                                                              // @ts-ignore
                                                              navigation.navigate(`AboutTrainingScreen`, {training: item});
                                                          }}>
                                    <View style={{
                                        elevation: 2,
                                        borderRadius: 2,
                                        backgroundColor: `#FFFFFF`,
                                        height: 78,
                                        flexDirection: `row`,
                                    }}>
                                        <YaMap nightMode={false}
                                               showUserPosition={false}
                                               mapType={"vector"}
                                               maxFps={30}
                                                // @ts-ignore
                                               interactive={false}
                                               logoPadding={{horizontal: 200, vertical: 200}}
                                               initialRegion={{
                                                   ...item.polyline[0],
                                                   zoom: 19
                                               }}
                                               style={{width: 78, borderRadius: 2}}>
                                            {/* todo - Ебучий полилайн */}
                                            <Polyline points={item.polyline != null
                                                    ? item.polyline
                                                    : [{...geolocationService.currentPosition}]}/>
                                        </YaMap>

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
                                                                      navigation.navigate(`AboutTrainingScreen`, {training: item});
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