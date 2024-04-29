import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ActivityScreenParamList} from "../ActivityScreen";
import {ScrollView, StyleSheet, View} from "react-native";
import YaMap, {Marker, Polyline} from "react-native-yamap";
import {Icon, MD3LightTheme, Text} from "react-native-paper";
import {colorSchema} from "../../../../../core/utils/ColorSchema";
import {Ways} from "../../../../domain/entity/Ways";
import {useRootStore} from "../../../shared/store/RootStore";
import {createRef, useEffect} from "react";
import {observer} from "mobx-react-lite";

type props = BottomTabScreenProps<ActivityScreenParamList>
export const ActivityMapTab = observer(({navigation, route}: props) => {
    const {runningStore, settingStore} = useRootStore();
    const yaMapRef = createRef<YaMap>();

    useEffect(() => {
        yaMapRef.current.fitAllMarkers();
    }, []);

    return (
            <ScrollView horizontal={false}
                        contentContainerStyle={style.container}>
                <YaMap ref={yaMapRef}
                       nightMode={false}
                       showUserPosition={false}
                       fastTapEnabled={false}
                       onCameraPositionChangeEnd={(event) => {
                           // setZoom(event.nativeEvent.zoom);
                       }}
                       mapType={"vector"}
                       maxFps={45}
                       initialRegion={{
                           ...runningStore.currentPosition,
                           zoom: 18.4
                       }}
                       style={{flex: 1}}>
                    <Marker point={{...runningStore.currentPosition}}
                            anchor={{
                                x: 0.015,
                                y: 0.24
                            }}
                            children={<Icon size={16}
                                            color={MD3LightTheme.colors.primary}
                                            source={`circle-slice-8`}/>}/>
                    {/* todo - Ебучий полилайн */}
                    <>
                        <Polyline points={runningStore.training != null
                                ? runningStore.training.polyline
                                : [{...runningStore.currentPosition}]}
                                  strokeColor={colorSchema.primary}
                                  strokeWidth={6}
                                  outlineColor={`#FFFFFF`}
                                  outlineWidth={1.4}/>
                    </>

                    {runningStore.training && runningStore.training.pause
                            ?
                            <>
                                {runningStore.training.ways.map((item: Ways) => {
                                    return (
                                            <View key={item.id}>
                                                <Marker point={item.polyline != null && item.polyline.length > 2
                                                        ? item.polyline[0]
                                                        : {...runningStore.currentPosition}}
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
                                                        : [{...runningStore.currentPosition}]}
                                                          strokeColor={`gray`}
                                                          strokeWidth={6}
                                                          outlineColor={`black`}
                                                          outlineWidth={1.4}/>
                                                <Marker point={item.polyline != null && item.polyline.length > 2
                                                        ? item.polyline[item.polyline.length - 1]
                                                        : {...runningStore.currentPosition}}
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
            </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1
    }
});