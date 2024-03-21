import {Image, RefreshControl, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../store/RootStore";
import {Activity} from "../entity/Activity";
import {Text} from "react-native-paper";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {MainStackParamList} from "../navigation/MainStack";
import {TotalStep} from "../components/TotalStep";
import {useLayoutEffect, useState} from "react";
import {AppBar} from "../components/AppBar";

type props = DrawerScreenProps<MainStackParamList, `PedometerScreen`>;
export const PedometerScreen = observer(({navigation, route}: props) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {userStore} = useRootStore();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => {
                return (
                        <AppBar title={`Pedometer`} action={() => navigation.goBack()}/>
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
                                        <Image source={require(`./../assets/image/footprints.png`)}
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
                                                <Text children={`Total step:`}
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