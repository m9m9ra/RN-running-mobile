import {HomeStack, HomeStackParamList} from "./HomeStack";
import {Settings} from "react-native";
import {createDrawerNavigator, DrawerContentComponentProps} from "@react-navigation/drawer";
import {DrawerMenu} from "../../../layers/presentation/shared/ui/DrawerMenu";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import {PedometerScreen} from "../../../layers/presentation/screens/PedometerScreen";
import {SettingsScreen} from "../../../layers/presentation/screens/SettingsScreen";


export type DrawerStackParamList = {
    HomeStack: HomeStackParamList,
    PedometerScreen: any,
    SettingsScreen: Settings | any
}

const Drawer = createDrawerNavigator<DrawerStackParamList>();
export const DrawerStack = () => {
    return (
        <Drawer.Navigator initialRouteName={`HomeStack`}
                          detachInactiveScreens={false}
                          drawerContent={(props: DrawerContentComponentProps) => <DrawerMenu {...props}/>}
                          screenOptions={{
                              swipeEnabled: false,
                              drawerStyle: {
                                  width: 240
                              },
                              headerShown: false,
                              swipeEdgeWidth: 77,
                              unmountOnBlur: false,

                          }}>

            <Drawer.Screen name={`HomeStack`}
                           options={({ route }) => {
                               const routeName = getFocusedRouteNameFromRoute(route) ?? 'ActivityScreen';
                               if (routeName == "ActivityScreen" || routeName == `ProfileScreen`)
                                   return ({swipeEnabled: false})
                               else
                                   return ({swipeEnabled: true})
                           }}
                           component={HomeStack}/>

            <Drawer.Screen name={`PedometerScreen`}
                           options={{
                               swipeEnabled: true
                           }}
                           component={PedometerScreen}/>

            <Drawer.Screen name={`SettingsScreen`}
                           options={{
                               swipeEnabled: true
                           }}
                           component={SettingsScreen}/>
        </Drawer.Navigator>
    )
}