import {ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {HomeStackParamList} from "../navigation/modules/HomeStack";
import {useLayoutEffect} from "react";
import {Appbar, Icon, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {MapMini} from "../components/MapMini";
import {useRootStore} from "../store/RootStore";

type props = BottomTabScreenProps<HomeStackParamList, `ActivityScreen`>;
export const ActivityScreen = observer(({navigation, route}: props) => {
    const {t} = useTranslation();
    const {timer, toggleRunning, startGpsService, stopGpsService} = useRootStore();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);


    return (
        <ScrollView horizontal={false}
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
                {/*    alignItems: `flex-end`,*/}
                {/*    justifyContent: `flex-end`*/}
                {/*}}>*/}
                {/*    <Icon size={24}*/}
                {/*          source={`map-marker`}*/}
                {/*          color={`green`}/>*/}
                {/*</View>*/}

                <View style={{
                    alignItems: `center`,
                    marginTop: 24
                }}>
                    <Text disabled={false}
                          children={`${timer}`}
                          style={style.headerText}/>
                    <Text children={t(`ACTION.DURATION`)}
                          style={style.headerLabel}/>
                </View>

                <View style={{
                    flexDirection: `row`,
                    width: `100%`,
                    justifyContent: `space-between`,
                    marginTop: 24
                }}>
                    <View>
                        <Text children={`0.00`}
                              style={style.headerScore}/>
                        <Text children={t(`ACTION.DISTANCE`)}
                              style={style.headerLabel}/>
                    </View>

                    <View>
                        <Text children={`00:00`}
                              style={style.headerScore}/>
                        <Text children={t(`ACTION.CALORIES`)}
                              style={style.headerLabel}/>
                    </View>

                    <View>
                        <Text children={`00:00`}
                              style={style.headerScore}/>
                        <Text children={t(`ACTION.AVERAGE`)}
                              style={style.headerLabel}/>
                    </View>

                </View>
            </Appbar.Header>

            <MapMini/>

            <View style={{
                paddingHorizontal: 24,
                position: `absolute`,
                bottom: 24,
                left: 0,
                right: 0
            }}>
                <TouchableWithoutFeedback disabled={false}
                                          onPress={async () => {
                                              const isRunning = await toggleRunning();
                                              if (isRunning) {
                                                  await startGpsService();
                                              } else {
                                                  await stopGpsService();
                                              }
                                          }}>
                    <View style={{
                        backgroundColor: `black`,
                        paddingHorizontal: 9,
                        paddingVertical: 16,
                        flexDirection: `row`,
                        justifyContent: `space-between`,
                        elevation: 4
                    }}>
                        <TouchableOpacity disabled={false}
                                          children={<Text children={t(`ACTION.START_TIMER`).toUpperCase()}
                                                          style={{
                                                              color: `#FFFFFF`,
                                                              fontSize: 13,
                                                              letterSpacing: 2.6,
                                                              fontWeight: `700`
                                                          }}/>}
                                          onPress={async () => {
                                              const isRunning = await toggleRunning();
                                              if (isRunning) {
                                                  await startGpsService();
                                              } else {
                                                  await stopGpsService();
                                              }
                                          }}/>
                        <TouchableOpacity disabled={false}
                                          children={<Icon size={18} source={`arrow-right`} color={`#FFFFFF`}/>}
                                          onPress={async () => {
                                              const isRunning = await toggleRunning();
                                              if (isRunning) {
                                                  await startGpsService();
                                              } else {
                                                  await stopGpsService();
                                              }
                                          }}/>
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