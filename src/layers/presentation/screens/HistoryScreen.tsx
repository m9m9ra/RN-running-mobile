import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {Appbar, Avatar, Divider, Icon, MD3LightTheme, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {StackHeaderProps, StackScreenProps} from "@react-navigation/stack";
import {MainStackParamList} from "../../../core/navigation/MainStack";
import {useRootStore} from "../shared/store/RootStore";
import {Training} from "../../domain/entity/Training";
import YaMap, {Polyline} from "react-native-yamap";
import {colorSchema} from "../../../core/utils/ColorSchema";

type props = StackScreenProps<MainStackParamList, `HistoryScreen`>;
export const HistoryScreen = observer(({navigation, route}: props) => {
    const {t, i18n} = useTranslation();
    const [languages, setLanguages] = useState<string[]>(Object.keys(i18n.options.resources));
    const [currentLanguages, setCurrentLanguages] = useState<string>(i18n.language);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {settingStore, geolocationService, userStore} = useRootStore();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (props: StackHeaderProps) => {

                return (
                        <Appbar.Header elevated
                                       style={{
                                           backgroundColor: Colors.lighter,
                                           justifyContent: `space-between`
                                       }}>
                            <View style={{
                                flexDirection: `row`,
                                alignItems: `center`,
                                paddingLeft: 12
                            }}>
                                <TouchableOpacity disabled={false}
                                                  onPress={() => {
                                                      navigation.goBack();
                                                  }}
                                                  style={{
                                                      marginRight: 12
                                                  }}
                                                  children={<Icon size={28}
                                                                  source={"arrow-left"}/>}/>
                                <Appbar.Header mode={`small`}
                                               children={<Text children={t(`TRAINING_HISTORY`)}
                                                               style={{
                                                                   fontWeight: `700`,
                                                                   letterSpacing: 1,
                                                                   textAlign: `center`
                                                               }}/>}
                                               style={{
                                                   backgroundColor: Colors.lighter
                                               }}/>
                            </View>
                            <View style={{
                                flexDirection: `row`,
                                alignItems: `center`,
                                paddingRight: 12,
                                gap: 8
                            }}>
                                <TouchableOpacity disabled={false}
                                                  children={<Icon size={22}
                                                                  source={`share-variant`}/>}/>

                                <TouchableOpacity disabled={false}
                                                  children={<Icon size={26}
                                                                  source={`dots-vertical`}/>}/>
                            </View>
                        </Appbar.Header>
                )
            }
        });
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1450);
    };

    return (
            <ScrollView horizontal={false}
                        refreshControl={<RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}
                        contentContainerStyle={style.container}>

                <View style={{
                    flexDirection: `row`,
                    width: `100%`,
                    justifyContent: `space-between`,
                    paddingVertical: 16,
                    borderBottomColor: `#d2d2d2`,
                    borderBottomWidth: 1,
                    paddingHorizontal: 24
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

                <View style={{
                    gap: 12,
                    marginTop: 12,
                    paddingHorizontal: 24,
                    paddingBottom: 34
                }}>
                    <Text children={`History`}
                          style={style.headerLabel}/>

                    {userStore.user.training.map((item: Training, index: number) => {
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
                                               mapType={"raster"}
                                               maxFps={15}
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
        flexGrow: 1
    },
    headerScore: {
        fontSize: 28,
        fontWeight: `700`
    },
    headerLabel: {}
});