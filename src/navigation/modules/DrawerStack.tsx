import {SettingsScreen} from "../../screens/SettingsScreen";
import {PedometerScreen} from "../../screens/PedometerScreen";
import {HomeStack, HomeStackParamList} from "./HomeStack";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import {createDrawerNavigator, DrawerContentComponentProps} from "@react-navigation/drawer";
import {DrawerMenu} from "../../components/DrawerMenu";
import {Settings} from "../../entity/Settings";

export type DrawerStackParamList = {
    HomeStack: HomeStackParamList,
    PedometerScreen: any,
    SettingsScreen: Settings | any,
    // LanguageScreen: Settings | any,
    // AboutTrainingScreen: {
    //     training: Training
    // }
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

            {/*<Drawer.Screen name={`LanguageScreen`}*/}
            {/*               options={{*/}
            {/*                   swipeEnabled: false*/}
            {/*               }}*/}
            {/*               component={LanguageScreen}/>*/}

            {/*<Drawer.Screen name={`AboutTrainingScreen`}*/}
            {/*               options={{*/}
            {/*                   swipeEnabled: false*/}
            {/*               }}*/}
            {/*               component={AboutTrainingScreen}/>*/}
        </Drawer.Navigator>
    )
}