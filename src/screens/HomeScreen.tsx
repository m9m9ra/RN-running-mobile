import {Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Image} from "react-native";
import {Appbar, Avatar, Icon, MD3LightTheme, Text} from "react-native-paper";
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


type props = BottomTabScreenProps<HomeStackParamList, `HomeScreen`>;

export const HomeScreen = observer(({navigation, route}: props) => {
    const [data, setData] = useState<Array<number>>([]);
    const [selectedDay, setSelectedDay] = useState<number>(26);
    const navigationState = useNavigation();
    const {stepCounter, userStore, training} = useRootStore();
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
        }
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
                                  borderRadius: 16,
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

    return (
        <ScrollView horizontal={false}
                    nestedScrollEnabled={false}
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

            <Text children={JSON.stringify(training)}
                  style={{
                      marginTop: 24,
                      paddingHorizontal: 4,
                      fontWeight: `700`
                  }}/>

            <Text children={JSON.stringify(userStore.user)}
                  style={{
                      marginTop: 12,
                      marginBottom: 24,
                      paddingHorizontal: 4,
                      fontWeight: `700`
                  }}/>

        </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24
    }
});