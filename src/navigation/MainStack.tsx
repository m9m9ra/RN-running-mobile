import {createStackNavigator} from "@react-navigation/stack";
import {HomeStack, HomeStackParamList} from "./modules/HomeStack";
import {createDrawerNavigator, DrawerContentComponentProps} from "@react-navigation/drawer";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import {PedometerScreen} from "../screens/PedometerScreen";
import {SettingsScreen} from "../screens/SettingsScreen";
import {DrawerMenu} from "../components/DrawerMenu";
import {Settings} from "../entity/Settings";
import {LanguageScreen} from "../screens/LanguageScreen";

export type MainStackParamList = {
    HomeStack: HomeStackParamList,
    PedometerScreen: any,
    SettingsScreen: Settings | any,
    LanguageScreen: Settings | any,
}

// const Stack = createStackNavigator<MainStackParamList>();
const Drawer = createDrawerNavigator<MainStackParamList>();
export const MainStack = () => {
    return (
        <Drawer.Navigator initialRouteName={`HomeStack`}
                          drawerContent={(props: DrawerContentComponentProps) => <DrawerMenu {...props}/>}
                          screenOptions={{
                              swipeEnabled: false,
                              drawerStyle: {
                                  width: 240
                              },
                              headerShown: false,
                              swipeEdgeWidth: 77,
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

            <Drawer.Screen name={`LanguageScreen`}
                           options={{
                               swipeEnabled: false
                           }}
                           component={LanguageScreen}/>
        </Drawer.Navigator>
    )
}