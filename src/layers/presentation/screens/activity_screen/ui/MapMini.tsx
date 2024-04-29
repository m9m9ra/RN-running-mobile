import {ScrollView, StyleSheet} from "react-native";
import {observer} from "mobx-react-lite";
import YaMap, {Marker} from "react-native-yamap";
import {createRef} from "react";
import {useRootStore} from "../../../shared/store/RootStore";
import {Icon, MD3LightTheme} from "react-native-paper";

export const MapMini = observer(() => {
    const {runningStore, settingStore} = useRootStore();
    const yaMapRef = createRef<YaMap>();

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
                </YaMap>
            </ScrollView>
    );
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1
    }
});