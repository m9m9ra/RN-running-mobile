import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ActivityScreenParamList} from "../ActivityScreen";
import {Image, ScrollView, StyleSheet, View} from "react-native";
import {Divider, Icon, Text} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../../../shared/store/RootStore";
import COLORS from "react-native-circular-progress-indicator/lib/typescript/utils/colors";
import {Colors} from "react-native/Libraries/NewAppScreen";

type props = BottomTabScreenProps<ActivityScreenParamList>
export const ActivityProgressTab = observer(({navigation, route}: props) => {
    const {t} = useTranslation();
    const {runningStore} = useRootStore();

    return (
            <ScrollView horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.container}>
                <Text children={t(`NEW_FUTURE`)}
                      style={{
                          fontSize: 16
                      }}/>

                {/*todo - Training result -------------------------------------------------------------------*/}
                {/*<View style={{*/}
                {/*    paddingHorizontal: 24,*/}
                {/*    paddingTop: 12,*/}
                {/*    gap: 22*/}
                {/*}}>*/}

                {/*    <Text children={t('TRAINING_RESULT')}*/}
                {/*          style={{*/}
                {/*              fontWeight: `700`,*/}
                {/*              fontSize: 18,*/}
                {/*              marginBottom: 8,*/}
                {/*              letterSpacing: 0.8*/}
                {/*          }}/>*/}
                {/*    <View style={{*/}
                {/*        flexDirection: `row`,*/}
                {/*        alignItems: `center`,*/}
                {/*        justifyContent: `space-between`*/}
                {/*    }}>*/}
                {/*        <View style={{*/}
                {/*            flexDirection: `row`,*/}
                {/*            alignItems: `center`,*/}
                {/*            gap: 4*/}
                {/*        }}>*/}
                {/*            <Icon size={32} source={`timer-sand`}/>*/}
                {/*            <Text children={`${t(`PROGRESS.START_AT`)}:`}*/}
                {/*                  style={{*/}
                {/*                      fontSize: 16,*/}
                {/*                      fontWeight: `700`*/}
                {/*                  }}/>*/}
                {/*        </View>*/}
                {/*        <Text children={`${runningStore.training.start_data ? runningStore.training.start_data : `unknown`}`}*/}
                {/*              style={{*/}
                {/*                  fontSize: 16,*/}
                {/*                  fontWeight: `400`*/}
                {/*              }}/>*/}
                {/*    </View>*/}

                {/*    <View style={{*/}
                {/*        flexDirection: `row`,*/}
                {/*        alignItems: `center`,*/}
                {/*        justifyContent: `space-between`*/}
                {/*    }}>*/}
                {/*        <View style={{*/}
                {/*            flexDirection: `row`,*/}
                {/*            alignItems: `center`,*/}
                {/*            gap: 8*/}
                {/*        }}>*/}
                {/*            <Icon size={34} source={`timer-outline`}/>*/}
                {/*            <Text children={`${t(`PROGRESS.AVERAGE_PACE`)}:`}*/}
                {/*                  style={{*/}
                {/*                      fontSize: 16,*/}
                {/*                      fontWeight: `700`*/}
                {/*                  }}/>*/}
                {/*        </View>*/}

                {/*        <Text children={`${runningStore.training.average_pace != null ? runningStore.training.average_pace : `0.00`} min/km`}*/}
                {/*              style={{*/}
                {/*                  fontSize: 16,*/}
                {/*                  fontWeight: `400`*/}
                {/*              }}/>*/}
                {/*    </View>*/}

                {/*    <View style={{*/}
                {/*        flexDirection: `row`,*/}
                {/*        alignItems: `center`,*/}
                {/*        justifyContent: `space-between`*/}
                {/*    }}>*/}
                {/*        <View style={{*/}
                {/*            flexDirection: `row`,*/}
                {/*            alignItems: `center`,*/}
                {/*            gap: 8*/}
                {/*        }}>*/}
                {/*            <Icon size={34} source={`speedometer-medium`}/>*/}
                {/*            <Text children={`${t(`PROGRESS.AVERAGE_SPEED`)}:`}*/}
                {/*                  style={{*/}
                {/*                      fontSize: 16,*/}
                {/*                      fontWeight: `700`*/}
                {/*                  }}/>*/}
                {/*        </View>*/}

                {/*        <Text children={`${runningStore.training.average != null ? runningStore.training.average : `0.00`} kph`}*/}
                {/*              style={{*/}
                {/*                  fontSize: 16,*/}
                {/*                  fontWeight: `400`*/}
                {/*              }}/>*/}
                {/*    </View>*/}

                {/*    <View style={{*/}
                {/*        flexDirection: `row`,*/}
                {/*        alignItems: `center`,*/}
                {/*        justifyContent: `space-between`*/}
                {/*    }}>*/}
                {/*        <View style={{*/}
                {/*            flexDirection: `row`,*/}
                {/*            alignItems: `center`,*/}
                {/*            gap: 8*/}
                {/*        }}>*/}
                {/*            <Icon size={34} source={`speedometer`}/>*/}
                {/*            <Text children={`${t(`PROGRESS.MAX_SPEED`)}:`}*/}
                {/*                  style={{*/}
                {/*                      fontSize: 16,*/}
                {/*                      fontWeight: `700`*/}
                {/*                  }}/>*/}
                {/*        </View>*/}

                {/*        <Text children={`${runningStore.training.max_speed != null ? runningStore.training.max_speed : `0.00`} kph`}*/}
                {/*              style={{*/}
                {/*                  fontSize: 16,*/}
                {/*                  fontWeight: `400`*/}
                {/*              }}/>*/}
                {/*    </View>*/}

                {/*    <View style={{*/}
                {/*        flexDirection: `row`,*/}
                {/*        alignItems: `center`,*/}
                {/*        justifyContent: `space-between`*/}
                {/*    }}>*/}
                {/*        <View style={{*/}
                {/*            flexDirection: `row`,*/}
                {/*            alignItems: `center`,*/}
                {/*            gap: 4*/}
                {/*        }}>*/}
                {/*            <Image source={require(`./../../../../../../assets/image/footprints.png`)}*/}
                {/*                   style={{*/}
                {/*                       height: 34,*/}
                {/*                       width: 34*/}
                {/*                   }}/>*/}
                {/*            <Text children={`${t(`PROGRESS.AVERAGE_STEP`)}:`}*/}
                {/*                  style={{*/}
                {/*                      fontSize: 16,*/}
                {/*                      fontWeight: `700`*/}
                {/*                  }}/>*/}
                {/*        </View>*/}
                {/*        <Text children={`${runningStore.training.average_step != null ? runningStore.training.average_step : 1} step/min`}*/}
                {/*              style={{*/}
                {/*                  fontSize: 16,*/}
                {/*                  fontWeight: `400`*/}
                {/*              }}/>*/}
                {/*    </View>*/}

                {/*    <View style={{*/}
                {/*        flexDirection: `row`,*/}
                {/*        alignItems: `center`,*/}
                {/*        justifyContent: `space-between`*/}
                {/*    }}>*/}
                {/*        <View style={{*/}
                {/*            flexDirection: `row`,*/}
                {/*            alignItems: `center`,*/}
                {/*            gap: 4*/}
                {/*        }}>*/}
                {/*            <Image source={require(`./../../../../../../assets/image/footprints.png`)}*/}
                {/*                   style={{*/}
                {/*                       height: 34,*/}
                {/*                       width: 34*/}
                {/*                   }}/>*/}
                {/*            <Text children={`${t(`PROGRESS.TOTAL_STEP`)}:`}*/}
                {/*                  style={{*/}
                {/*                      fontSize: 16,*/}
                {/*                      fontWeight: `700`*/}
                {/*                  }}/>*/}
                {/*        </View>*/}
                {/*        <Text children={`${runningStore.training.step_count != null ? runningStore.training.step_count : 1} step`}*/}
                {/*              style={{*/}
                {/*                  fontSize: 16,*/}
                {/*                  fontWeight: `400`*/}
                {/*              }}/>*/}
                {/*    </View>*/}
                {/*</View>*/}
            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.lighter,
        alignItems: `center`,
        justifyContent: `center`,
        paddingBottom: 120
    }
});