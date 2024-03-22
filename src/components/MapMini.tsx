import {RefreshControl, ScrollView, StyleSheet, View} from "react-native";
import {observer} from "mobx-react-lite";
import YaMap, {Marker, Point, Polyline} from "react-native-yamap";
import {createRef, useEffect, useState} from "react";
import {useRootStore} from "../store/RootStore";
import {Text} from "react-native-paper";

export const MapMini = observer(() => {
    const {geolocationService} = useRootStore();
    const yaMapRef = createRef<YaMap>();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [defaultPosition, setDefaultPosition] = useState({
        lat: 54.7065,
        lon: 20.511,
    });

    useEffect(() => {
        console.log(geolocationService.geolocation, geolocationService.currentPosition);
        // geolocationService.geolocation.length > 2 ? setDefaultPosition({
        //     lon: geolocationService.geolocation['coords']['longitude'],
        //     lat: geolocationService.geolocation['coords']['latitude']
        // }) : false;

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
                <Text children={JSON.stringify(geolocationService.geolocation)}
                      style={{
                          position: `absolute`,
                          top: 0,
                          zIndex: 10,
                          padding: 12,
                          fontWeight: `700`
                      }}/>
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
                            <Marker point={{...geolocationService.currentPosition}}/>
                            {/* todo - Ебучий полилайн */}
                            {/*<Polyline points={geolocationService.geolocation.length > 1*/}
                            {/*        ? geolocationService.geolocation*/}
                            {/*        : [{...geolocationService.currentPosition}]}/>*/}
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