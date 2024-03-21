import {ScrollView, StyleSheet} from "react-native";
import {observer} from "mobx-react-lite";
import YaMap, {Marker} from "react-native-yamap";
import {useEffect, useState} from "react";
import {useRootStore} from "../store/RootStore";

export const MapMini = observer(() => {
    const {geolocationService} = useRootStore();
    const [defaultPosition, setDefaultPosition] = useState({
        lat: 54.7065,
        lon: 20.511,
    });

    useEffect(() => {
        console.log(geolocationService.geolocation);
    }, []);

    return (
        <ScrollView horizontal={false}
                    contentContainerStyle={style.container}>
            <YaMap nightMode={false}
                   showUserPosition={false}
                   mapType={"vector"}
                   maxFps={45}
                   initialRegion={{
                       ...defaultPosition,
                       zoom: 12
                   }}
                   style={{flex: 1}}>
                {/*<Marker point={geolocationService.geolocation.length > 1 ? geolocationService[geolocationService.geolocation.length - 1][`coords`] : defaultPosition}/>*/}
            </YaMap>
        </ScrollView>
    );
});

const style = StyleSheet.create({
   container: {
       flexGrow: 1
   }
});