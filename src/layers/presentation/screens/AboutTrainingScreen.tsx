import {DrawerHeaderProps, DrawerScreenProps} from "@react-navigation/drawer";
import {MainStackParamList} from "../../../core/navigation/MainStack";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useLayoutEffect, useState} from "react";
import {useRootStore} from "../shared/store/RootStore";
import {Appbar, Divider, Icon, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import YaMap, {Polyline} from "react-native-yamap";


type props = DrawerScreenProps<MainStackParamList, `AboutTrainingScreen`>;
export const AboutTrainingScreen = observer(({navigation, route}: props) => {
    const {t, i18n} = useTranslation();
    const [languages, setLanguages] = useState<string[]>(Object.keys(i18n.options.resources));
    const [currentLanguages, setCurrentLanguages] = useState<string>(i18n.language);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const {settingStore, geolocationService} = useRootStore();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (props: DrawerHeaderProps) => {

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
                                               children={<Text children={t(`TRAINING_RESULT`)}
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

                {!refreshing
                        ?
                        <YaMap nightMode={false}
                               showUserPosition={false}
                               mapType={"vector"}
                               maxFps={30}
                                // @ts-ignore
                               interactive={false}
                               logoPadding={{horizontal: 0, vertical: 0}}
                               initialRegion={{
                                   ...route.params.training.polyline[0],
                                   zoom: 18
                               }}
                               style={{height: 220, borderRadius: 0}}>
                            {/* todo - Ебучий полилайн */}
                            <Polyline points={route.params.training.polyline != null
                                    ? route.params.training.polyline
                                    : [{...geolocationService.currentPosition}]}/>
                        </YaMap>
                        :
                        <View style={{height: 220, borderRadius: 0, backgroundColor: `#FFFFFF`}}/>
                }

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
                    paddingHorizontal: 24,
                    paddingTop: 12,
                    gap: 12
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
                            gap: 4
                        }}>
                            <Icon size={22} source={`camera-timer`}/>
                            <Text children={`Duration:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `400`
                                  }}/>
                        </View>
                        <Text children={`${route.params.training.duration != null ? route.params.training.duration : `00:00`} min`}
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
                            <Icon size={22} source={`fire`}/>
                            <Text children={`Kcal:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `400`
                                  }}/>
                        </View>
                        <Text children={`${route.params.training.kcal != null ? route.params.training.kcal : 1} kcal`}
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
                            <Icon size={22} source={`speedometer`}/>
                            <Text children={`Average:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `400`
                                  }}/>
                        </View>

                        <Text children={`${route.params.training.average != null ? route.params.training.average : `0.00`} km/min`}
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
                            <Icon size={22} source={`image-filter-hdr`}/>
                            <Text children={`Distance:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `400`
                                  }}/>
                        </View>
                        <Text children={`${route.params.training.distance != null ? route.params.training.distance : `0.00`} km`}
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
                                       height: 22,
                                       width: 22
                                   }}/>
                            <Text children={`Total step:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `400`
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
                            <Icon size={22} source={`speedometer`}/>
                            <Text children={`Training start at:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `400`
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
                            <Icon size={22} source={`speedometer`}/>
                            <Text children={`Training end at:`}
                                  style={{
                                      fontSize: 16,
                                      fontWeight: `400`
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
        flexGrow: 1
    },
    headerScore: {
        fontSize: 28,
        fontWeight: `700`
    },
    headerLabel: {}
});