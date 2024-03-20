import {Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Image} from "react-native";
import {Appbar, Avatar, Icon, MD3LightTheme, Text} from "react-native-paper";
import {observer} from "mobx-react-lite";
import {useServiceProvider} from "../modules/ServicesProvider";
import { BottomTabHeaderProps, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "../navigation/modules/HomeStack";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { LineChart} from "react-native-chart-kit";
import CircularProgress from "react-native-circular-progress-indicator";
import { daysInMonth } from "../utils/DayInMonth";
import { FlatList } from "react-native-gesture-handler";
import { FilterActivityScreen } from "../components/FilterActivityList";


type props = BottomTabScreenProps<HomeStackParamList, `HomeScreen`>;

export const HomeScreen = observer(({navigation, route}: props) => {
    const [data, setData] = useState<Array<number>>([]);
    const [selectedDay, setSelectedDay] = useState<number>(26);
    const navigationState = useNavigation();
    const {stepCounter} = useServiceProvider();

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (props: BottomTabHeaderProps) => {
                
                return (
                    <Appbar.Header elevated 
                                   style={{
                                    paddingHorizontal: 24,
                                    backgroundColor: Colors.lighter
                                   }} >
                        <TouchableOpacity disabled={false} 
                                          onPress={() => {
                                            navigationState.dispatch(DrawerActions.openDrawer);
                                          }}
                                          children={<Icon size={28} 
                                                          source={"menu"}/>}/>
                        {/* <Badge children={3}/> */}
                        <Appbar.Header mode={`small`}
                                    children={<Text children={`Progress`}
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
                console.log(dataToArr);
                data.push(dataToArr);

                dataToArr -= 1;
            };
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
                <Text children={`April 20, 2024`}
                      style={{
                        fontSize: 14,
                        fontWeight: `700`,
                        color: `gray`
                      }}/>
                <Text children={`Good day, M9M9Ra`}
                      style={{
                        fontSize: 24,
                        fontWeight: `700`
                      }}/>
            </View>

            <View style={{
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: `space-between`,
                gap: 12
            }}>
                <View style={{
                    flexDirection: `row`,
                    alignItems: `center`,
                    gap: 22
                }}>
                    <Image source={require(`./../assets/image/footprints.png`)} 
                        style={{
                            width: 50,
                            height: 50
                        }}/>
                    <View>
                        <Text children={`Total step`}
                            style={{
                                color: `gray`,
                                fontSize: 18,
                                fontWeight: `700`,
                                letterSpacing: 2.8
                            }}/>
                        <Text children={`${stepCounter.stepCount}`}
                            style={{
                                fontSize: 22,
                                fontWeight: `700`,
                                letterSpacing: 2.4
                            }}/>
                    </View>
                </View>

                <CircularProgress value={stepCounter.stepCount}
                                  title={`10000`}
                                  radius={38}
                                  maxValue={10000}
                                  titleColor="black"
                                  duration={10000}
                                  titleStyle={{fontWeight: `700`}}
                                  activeStrokeWidth={10}
                                  activeStrokeColor={stepCounter.stepCount > 5000 ? `#2ecc71` : `#ffa726`}
                                  progressValueColor={'black'}/>
            </View>

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
                <Text children={`My activity`} 
                      style={{
                        fontSize: 24,
                        fontWeight: `700`,
                        letterSpacing: 2.4
                      }}/>
                <LineChart  data={{
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