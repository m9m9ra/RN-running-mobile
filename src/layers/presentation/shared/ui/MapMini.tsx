import {RefreshControl, ScrollView, StyleSheet, View} from "react-native";
import {observer} from "mobx-react-lite";
import YaMap, {Marker, Polyline} from "react-native-yamap";
import {createRef, useEffect, useLayoutEffect, useState} from "react";
import {useRootStore} from "../store/RootStore";
import {Icon, MD3LightTheme, Text} from "react-native-paper";
import {colorSchema} from "../../../../core/utils/ColorSchema";

export const MapMini = observer(() => {
    const {runningStore} = useRootStore();
    const yaMapRef = createRef<YaMap>();

    useEffect(() => {
        yaMapRef.current.fitAllMarkers();
    }, []);

    return (
            <ScrollView horizontal={false}
                        contentContainerStyle={style.container}>
                {/*<Text children={JSON.stringify(runningStore.training != null ? runningStore.training.polyline : runningStore.training)}*/}
                {/*      style={{*/}
                {/*          position: `absolute`,*/}
                {/*          top: 0,*/}
                {/*          zIndex: 10,*/}
                {/*          padding: 12,*/}
                {/*          fontWeight: `700`*/}
                {/*      }}/>*/}
                <YaMap ref={yaMapRef}
                       nightMode={false}
                       showUserPosition={false}
                       mapType={"vector"}
                       maxFps={40}
                       initialRegion={{
                           ...runningStore.currentPosition,
                           zoom: 19
                       }}
                       style={{flex: 1}}>
                    <Marker point={{...runningStore.currentPosition}}
                            anchor={{
                                x: 0,
                                y: 0
                            }}
                            children={<Icon size={16}
                                            color={MD3LightTheme.colors.primary}
                                            source={`circle-slice-8`}/>}/>
                    {/* todo - Ебучий полилайн */}
                    <Polyline points={runningStore.training != null
                            ? runningStore.training.polyline
                            : [{...runningStore.currentPosition}]}
                              strokeColor={colorSchema.primary}
                              strokeWidth={6}
                              outlineColor={`#FFFFFF`}
                              outlineWidth={1.4}/>
                </YaMap>
            </ScrollView>
    );
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1
    }
});