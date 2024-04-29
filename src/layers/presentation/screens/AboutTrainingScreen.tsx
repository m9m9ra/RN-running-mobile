import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {createRef, useEffect, useLayoutEffect, useState} from "react";
import {useRootStore} from "../shared/store/RootStore";
import {Divider, Icon, Text} from "react-native-paper";
import {Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import YaMap, {Marker, Polyline} from "react-native-yamap";
import {colorSchema} from "../../../core/utils/ColorSchema";
import {AboutTrainingStackParamList} from "../../../core/navigation/modules/AboutTrainingStack";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {Ways} from "../../domain/entity/Ways";


type props = BottomTabScreenProps<AboutTrainingStackParamList, `AboutTrainingScreen`>;
export const AboutTrainingScreen = observer(({navigation, route}: props) => {
    const {t, i18n} = useTranslation();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {settingStore, geolocationService} = useRootStore();
    const yaMapRef = createRef<YaMap>();

    useEffect(() => {
        yaMapRef.current.fitMarkers(route.params.training.ways[0].polyline);
        yaMapRef.current.fitAllMarkers();
    }, [route.params.training]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1450);
    };


    return (
            <ScrollView horizontal={false}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}
                        contentContainerStyle={style.container}>

                {/*<Text children={JSON.stringify(route.params.training)}*/}
                {/*      style={{*/}
                {/*          position: `absolute`,*/}
                {/*          top: 14,*/}
                {/*          left: 24,*/}
                {/*          right: 24,*/}
                {/*          zIndex: 1000,*/}
                {/*          fontWeight: `700`,*/}
                {/*          fontSize: 14*/}
                {/*      }}/>*/}

                <YaMap ref={yaMapRef}
                       nightMode={false}
                       showUserPosition={false}
                       mapType={"vector"}
                       maxFps={40}
                        // @ts-ignore
                       interactive={true}
                       logoPadding={{horizontal: 0, vertical: 0}}
                        // initialRegion={{
                        //     ...route.params.training.polyline[0],
                        //     zoom: 17
                        // }}
                       style={{
                           height: 260,
                           borderRadius: 0
                       }}>
                    {/* todo - Ебучий полилайн */}
                    <Polyline points={route.params.training.polyline != null
                            ? route.params.training.polyline
                            : [{...geolocationService.currentPosition}]}
                              strokeColor={colorSchema.primary}
                              strokeWidth={6}
                              outlineColor={`#FFFFFF`}
                              outlineWidth={1.4}/>
                    {/* todo - Ебучий полилайн */}
                    {route.params.training && route.params.training.pause
                            ?
                            <>
                                {route.params.training.ways.map((item: Ways) => {
                                    return (
                                            <View key={item.id}>
                                                <Marker point={item.polyline != null && item.polyline.length > 2
                                                        ? item.polyline[0]
                                                        : {...geolocationService.currentPosition}}
                                                        children={<View style={{
                                                            backgroundColor: colorSchema.primary,
                                                            alignItems: `center`,
                                                            justifyContent: `center`,
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: 100,
                                                            borderColor: `#FFFFFF`,
                                                            borderWidth: 1
                                                        }}>
                                                            <Text children={`S`}
                                                                  style={{
                                                                      fontSize: 14,
                                                                      color: `#FFFFFF`
                                                                  }}/>
                                                        </View>}/>
                                                <Polyline points={item.polyline != null
                                                        ? item.polyline
                                                        : [{...geolocationService.currentPosition}]}
                                                          strokeColor={`gray`}
                                                          strokeWidth={6}
                                                          outlineColor={`black`}
                                                          outlineWidth={1.4}/>
                                                <Marker point={item.polyline != null && item.polyline.length > 2
                                                        ? item.polyline[item.polyline.length - 1]
                                                        : {...geolocationService.currentPosition}}
                                                        children={<View style={{
                                                            backgroundColor: colorSchema.primary,
                                                            alignItems: `center`,
                                                            justifyContent: `center`,
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: 100,
                                                            borderColor: `#FFFFFF`,
                                                            borderWidth: 1
                                                        }}>
                                                            <Text children={`F`}
                                                                  style={{
                                                                      fontSize: 14,
                                                                      color: `#FFFFFF`
                                                                  }}/>
                                                        </View>}/>
                                            </View>
                                    )
                                })
                                }
                            </>
                            :
                            false
                    }
                </YaMap>
                <Divider style={{
                    height: 2,
                    backgroundColor: colorSchema.secondary
                }}/>

                <View style={{
                    flexDirection: `row`,
                    width: `100%`,
                    justifyContent: `space-between`,
                    paddingVertical: 16,
                    borderBottomColor: `#d2d2d2`,
                    borderBottomWidth: 1,
                    paddingHorizontal: 24
                }}>
                    <View style={{
                        alignItems: `center`
                    }}>
                        <Text children={`${route.params.training.distance ? route.params.training.distance : `0.00`}`}
                              style={{
                                  ...style.headerScore,
                                  letterSpacing: -1
                              }}/>
                        <Text children={`${t(`ACTION.DISTANCE`)} [km]`}
                              style={style.headerLabel}/>
                    </View>

                    <View style={{
                        alignItems: `center`
                    }}>
                        <Text children={`${route.params.training.duration ? route.params.training.duration : `00:00:00`}`}
                              style={{
                                  ...style.headerScore,
                                  letterSpacing: -1
                              }}/>
                        <Text children={t(`ACTION.DURATION`)}
                              style={style.headerLabel}/>
                    </View>

                    <View style={{
                        alignItems: `center`
                    }}>
                        <Text children={`${route.params.training.kcal ? route.params.training.kcal : `0.00`}`}
                              style={{
                                  ...style.headerScore,
                                  letterSpacing: -1
                              }}/>
                        <Text children={t(`ACTION.CALORIES`)}
                              style={style.headerLabel}/>
                    </View>

                </View>


                {/*todo - Training result -------------------------------------------------------------------*/}
                <View style={{
                    paddingHorizontal: 24,
                    paddingTop: 12,
                    gap: 22
                }}>

                    <Text children={t('TRAINING_RESULT')}
                          style={{
                              fontWeight: `700`,
                              fontSize: 18,
                              marginBottom: 8,
                              letterSpacing: 0.8
                          }}/>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 8
                        }}>
                            <Icon size={34} source={`timer-outline`}/>
                            <Text children={`${t(`PROGRESS.AVERAGE_PACE`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>

                        <Text children={`${route.params.training.average_pace != null ? route.params.training.average_pace : `0.00`} min/km`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 8
                        }}>
                            <Icon size={34} source={`speedometer-medium`}/>
                            <Text children={`${t(`PROGRESS.AVERAGE_SPEED`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>

                        <Text children={`${route.params.training.average != null ? route.params.training.average : `0.00`} kph`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 8
                        }}>
                            <Icon size={34} source={`speedometer`}/>
                            <Text children={`${t(`PROGRESS.MAX_SPEED`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>

                        <Text children={`${route.params.training.max_speed != null ? route.params.training.max_speed : `0.00`} kph`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 8
                        }}>
                            <Icon size={34} source={`fire`}/>
                            <Text children={`${t(`PROGRESS.CALORIES`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>

                        <Text children={`${route.params.training.kcal != null ? route.params.training.kcal : `0.00`}`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 4
                        }}>
                            <Image source={require(`./../../../../assets/image/footprints.png`)}
                                   style={{
                                       height: 34,
                                       width: 34
                                   }}/>
                            <Text children={`${t(`PROGRESS.AVERAGE_STEP`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>
                        <Text children={`${route.params.training.average_step != null ? route.params.training.average_step : 1} step/min`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 4
                        }}>
                            <Image source={require(`./../../../../assets/image/footprints.png`)}
                                   style={{
                                       height: 34,
                                       width: 34
                                   }}/>
                            <Text children={`${t(`PROGRESS.TOTAL_STEP`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>
                        <Text children={`${route.params.training.step_count != null ? route.params.training.step_count : 1} step`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>

                    <Divider style={{
                        marginVertical: 6
                    }}/>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 4
                        }}>
                            <Icon size={32} source={`timer-sand`}/>
                            <Text children={`${t(`PROGRESS.START_AT`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>
                        <Text children={`${route.params.training.start_data ? route.params.training.start_data : `unknown`}`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>

                    <View style={{
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `space-between`
                    }}>
                        <View style={{
                            flexDirection: `row`,
                            alignItems: `center`,
                            gap: 4
                        }}>
                            <Icon size={32} source={`timer-sand-complete`}/>
                            <Text children={`${t(`PROGRESS.END_AT`)}:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `700`
                                  }}/>
                        </View>
                        <Text children={`${route.params.training.end_data ? route.params.training.end_data : `unknown`}`}
                              style={{
                                  fontSize: 16,
                                  fontWeight: `400`
                              }}/>
                    </View>
                </View>
            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 34,
        backgroundColor: Colors.lighter
    },
    headerScore: {
        fontSize: 28,
        fontWeight: `700`
    },
    headerLabel: {
        letterSpacing: -0.3
    }
});