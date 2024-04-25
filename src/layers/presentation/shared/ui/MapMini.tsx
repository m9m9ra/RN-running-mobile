import {ScrollView, StyleSheet, View} from "react-native";
import {observer} from "mobx-react-lite";
import YaMap, {Marker, Polyline} from "react-native-yamap";
import {createRef, useEffect, useState} from "react";
import {useRootStore} from "../store/RootStore";
import {Icon, MD3LightTheme} from "react-native-paper";
import {colorSchema} from "../../../../core/utils/ColorSchema";

export const MapMini = observer(() => {
    const {runningStore, settingStore} = useRootStore();
    const yaMapRef = createRef<YaMap>();
    // const [zoom, setZoom] = useState<number>(19);
    // const [polyPause, setPolyPause] = useState<Array<Poly[]>>([]);

    useEffect(() => {
        yaMapRef.current.fitAllMarkers();
        // console.log(runningStore.freeze.polyPause);
        console.log(runningStore.training);
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

                    {/*{runningStore.training && runningStore.training.pause*/}
                    {/*        ?*/}
                    {/*        <>*/}
                    {/*            {runningStore.freeze.polyPause.map((item: PolylinePause) => {*/}
                    {/*                return (*/}
                    {/*                        <Polyline key={item.id}*/}
                    {/*                                  points={item.polyline != null*/}
                    {/*                                          ? item.polyline*/}
                    {/*                                          : [{...runningStore.currentPosition}]}*/}
                    {/*                                  strokeColor={`gray`}*/}
                    {/*                                  strokeWidth={6}*/}
                    {/*                                  outlineColor={`black`}*/}
                    {/*                                  outlineWidth={1.4}/>*/}
                    {/*                )*/}
                    {/*            })*/}
                    {/*            }*/}
                    {/*        </>*/}
                    {/*        :*/}
                    {/*        false*/}
                    {/*}*/}
                    {/*<Marker key={item.id}*/}
                    {/*        point={item.polyline != null && item.polyline.length > 2*/}
                    {/*        ? item.polyline[0]*/}
                    {/*        : {...runningStore.currentPosition}}*/}
                    {/*        children={<View style={{*/}
                    {/*            backgroundColor: colorSchema.primary,*/}
                    {/*            alignItems: `center`,*/}
                    {/*            justifyContent: `center`,*/}
                    {/*            width: 24,*/}
                    {/*            height: 24,*/}
                    {/*            borderRadius: 100,*/}
                    {/*            borderColor: `#FFFFFF`,*/}
                    {/*            borderWidth: 1*/}
                    {/*        }}>*/}
                    {/*            <Text children={`S`}*/}
                    {/*                  style={{*/}
                    {/*                      fontSize: 14,*/}
                    {/*                      color: `#FFFFFF`*/}
                    {/*                  }}/>*/}
                    {/*        </View>}/>*/}
                    {/*<Marker key={item.id}*/}
                    {/*        point={item.polyline != null && item.polyline.length > 2*/}
                    {/*        ? item.polyline[item.polyline.length - 1]*/}
                    {/*        : {...runningStore.currentPosition}}*/}
                    {/*        children={<View style={{*/}
                    {/*            backgroundColor: colorSchema.primary,*/}
                    {/*            alignItems: `center`,*/}
                    {/*            justifyContent: `center`,*/}
                    {/*            width: 24,*/}
                    {/*            height: 24,*/}
                    {/*            borderRadius: 100,*/}
                    {/*            borderColor: `#FFFFFF`,*/}
                    {/*            borderWidth: 1*/}
                    {/*        }}>*/}
                    {/*            <Text children={`F`}*/}
                    {/*                  style={{*/}
                    {/*                      fontSize: 14,*/}
                    {/*                      color: `#FFFFFF`*/}
                    {/*                  }}/>*/}
                    {/*        </View>}/>*/}

                    {/*<Polyline points={runningStore.training.polyPause[0] != null*/}
                    {/*                  ? runningStore.training.polyPause[0].polyline*/}
                    {/*                  : [{...runningStore.currentPosition}]}*/}
                    {/*          strokeColor={colorSchema.primary}*/}
                    {/*          strokeWidth={6}*/}
                    {/*          outlineColor={`orange`}*/}
                    {/*          outlineWidth={1.4}/>*/}

                    {/*<Polyline points={runningStore.training != null*/}
                    {/*        ? runningStore.training.polyline*/}
                    {/*        : [{...runningStore.currentPosition}]}*/}
                    {/*          strokeColor={colorSchema.primary}*/}
                    {/*          strokeWidth={6}*/}
                    {/*          outlineColor={`#FFFFFF`}*/}
                    {/*          outlineWidth={1.4}/>*/}
                </YaMap>
            </ScrollView>
    );
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1
    }
});