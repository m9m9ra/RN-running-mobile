import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {createRef, useEffect, useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {Appbar, Avatar, Divider, Icon, MD3LightTheme, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {StackHeaderProps, StackScreenProps} from "@react-navigation/stack";
import {useRootStore} from "../shared/store/RootStore";
import {Training} from "../../domain/entity/Training";
import YaMap, {Polyline} from "react-native-yamap";
import {colorSchema} from "../../../core/utils/ColorSchema";
import {ProgressStackParamList} from "../../../core/navigation/modules/ProgressStack";

type props = StackScreenProps<ProgressStackParamList, `HistoryScreen`>;
export const HistoryScreen = observer(({navigation, route}: props) => {
    const {t, i18n} = useTranslation();
    const [languages, setLanguages] = useState<string[]>(Object.keys(i18n.options.resources));
    const [currentLanguages, setCurrentLanguages] = useState<string>(i18n.language);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [sortedTrainingCount, setSortedTrainingCount] = useState<number>(10);
    const {settingStore, geolocationService, userStore} = useRootStore();

    const [totalResult, setTotalResult] = useState({
        distance: 0,
        calories: 0,
        average_pace: 0
    });

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

    useEffect(() => {
        const total = {
            distance: 0,
            calories: 0,
            average_pace: 0
        };

        userStore.user.training.forEach(training => {
            total.distance += Number(training.distance);
            total.calories += Number(training.kcal);
            total.average_pace += Number(training.average_pace);
            // total.average += training.distance;
        });

        total.distance = Number(total.distance.toFixed(2));
        total.average_pace = Number(total.average_pace.toFixed(2));

        setTotalResult(total);
    }, []);

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
                        <Text children={`${totalResult.distance}`}
                              style={style.headerScore}/>
                        <Text children={t(`ACTION.DISTANCE`)}
                              style={style.headerLabel}/>
                    </View>

                    <View>
                        <Text children={`${totalResult.calories}`}
                              style={style.headerScore}/>
                        <Text children={t(`ACTION.CALORIES`)}
                              style={style.headerLabel}/>
                    </View>

                    <View>
                        <Text children={`${totalResult.average_pace}`}
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
                    {/*<Text children={`History`}*/}
                    {/*      style={style.headerLabel}/>*/}

                    <Text children={`${t("PROGRESS.HISTORY")}`.toUpperCase()}
                          style={{
                              fontSize: 16,
                              fontWeight: `700`,
                              letterSpacing: 2.4
                          }}/>

                    {userStore.user.training.slice(0, sortedTrainingCount).map((item: Training, index: number) => {
                        const yaMapRef = createRef<YaMap>();

                        // yaMapRef.current.fitMarkers(item.polyline);

                        return (
                                <TouchableWithoutFeedback key={item.id}
                                                          onPress={() => {
                                                              // // @ts-ignore
                                                              // navigation.navigate(`AboutTrainingScreen`, {
                                                              //     // @ts-ignore
                                                              //     screen: `AboutTrainingScreen`,
                                                              //     params: {training: item}
                                                              // });
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
                                        <YaMap ref={yaMapRef}
                                               nightMode={false}
                                               showUserPosition={false}
                                               mapType={"raster"}
                                               maxFps={5}
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
                                                    : [{...geolocationService.currentPosition}]}
                                                      strokeColor={colorSchema.primary}
                                                      strokeWidth={3}
                                                      outlineColor={`#FFFFFF`}
                                                      outlineWidth={2}/>
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

                    {sortedTrainingCount < userStore.user.training.length
                            ?
                            <TouchableOpacity disabled={false}
                                              onPress={() => {
                                                  setRefreshing(true);
                                                  setSortedTrainingCount(sortedTrainingCount + 7);
                                                  setTimeout(() => {
                                                      setRefreshing(false);
                                                  }, 250);
                                              }}
                                              style={{
                                                  alignItems: `center`,
                                                  justifyContent: `center`,
                                                  marginTop: 4
                                              }}
                                              children={<Text children={`Load more`}
                                                              style={{
                                                                  fontSize: 16,
                                                                  color: MD3LightTheme.colors.primary
                                                              }}/>}/>
                            :
                            false
                    }
                </View>
            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.lighter
    },
    headerScore: {
        fontSize: 28,
        fontWeight: `700`,
        textAlign: `center`
    },
    headerLabel: {}
});