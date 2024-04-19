import {ScrollView, StyleSheet} from "react-native";
import {observer} from "mobx-react-lite";
import YaMap, {Marker, Polyline} from "react-native-yamap";
import {createRef, useEffect, useState} from "react";
import {useRootStore} from "../store/RootStore";
import {Icon, MD3LightTheme} from "react-native-paper";
import {colorSchema} from "../../../../core/utils/ColorSchema";

export const MapMini = observer(() => {
    const {runningStore} = useRootStore();
    const yaMapRef = createRef<YaMap>();
    const [zoom, setZoom] = useState<number>(19);

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
                           setZoom(event.nativeEvent.zoom);
                       }}
                       mapType={"vector"}
                       maxFps={45}
                       initialRegion={{
                           ...runningStore.currentPosition,
                           zoom: 19
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