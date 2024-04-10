import {RefreshControl, ScrollView, StyleSheet, View} from "react-native";
import {observer} from "mobx-react-lite";
import YaMap, {Marker, Point, Polyline} from "react-native-yamap";
import {createRef, useEffect, useState} from "react";
import {useRootStore} from "../store/RootStore";
import {Icon, Text} from "react-native-paper";
import {colorSchema} from "../../../../core/utils/ColorSchema";

export const MapMini = observer(() => {
    const {training, geolocationService} = useRootStore();
    const yaMapRef = createRef<YaMap>();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [defaultPosition, setDefaultPosition] = useState({
        lat: 54.7065,
        lon: 20.511,
    });

    useEffect(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 360)
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 560)
    };

    return (
            <ScrollView horizontal={false}
                        refreshControl={<RefreshControl refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}
                        contentContainerStyle={style.container}>
                {/*<Text children={JSON.stringify(training != null ? training.polyline : training)}*/}
                {/*      style={{*/}
                {/*          position: `absolute`,*/}
                {/*          top: 0,*/}
                {/*          zIndex: 10,*/}
                {/*          padding: 12,*/}
                {/*          fontWeight: `700`*/}
                {/*      }}/>*/}
                {!refreshing ?
                        <YaMap ref={yaMapRef}
                               nightMode={false}
                               showUserPosition={false}
                               mapType={"vector"}
                               maxFps={60}
                               initialRegion={{
                                   ...geolocationService.currentPosition,
                                   zoom: 19
                               }}
                               style={{flex: 1}}>
                            <Marker point={{...geolocationService.currentPosition}}
                                    anchor={{
                                        x: 0,
                                        y: 0
                                    }}
                                    children={<Icon size={16}
                                                    source={`circle-slice-8`}/>}/>
                            {/* todo - Ебучий полилайн */}
                            <Polyline points={training != null
                                    ? training.polyline
                                    : [{...geolocationService.currentPosition}]}
                                      strokeColor={colorSchema.primary}
                                      strokeWidth={6}
                                      outlineColor={`#FFFFFF`}
                                      outlineWidth={1.4}/>
                        </YaMap>
                        : false}
            </ScrollView>
    );
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1
    }
});