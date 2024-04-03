import {HomeStack, HomeStackParamList} from "./modules/HomeStack";
import {createDrawerNavigator, DrawerContentComponentProps} from "@react-navigation/drawer";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import {PedometerScreen} from "../screens/PedometerScreen";
import {SettingsScreen} from "../screens/SettingsScreen";
import {DrawerMenu} from "../components/DrawerMenu";
import {Settings} from "../entity/Settings";
import {LanguageScreen} from "../screens/LanguageScreen";
import {AboutTrainingScreen} from "../screens/AboutTrainingScreen";
import {Training} from "../entity/Training";
import {createStackNavigator} from "@react-navigation/stack";
import {DrawerStack, DrawerStackParamList} from "./modules/DrawerStack";
import {HistoryScreen} from "../screens/HistoryScreen";

export type MainStackParamList = {
    DrawerStack: DrawerStackParamList,
    LanguageScreen: Settings | any,
    AboutTrainingScreen: {
        training: Training
    },
    HistoryScreen: any
}

const Stack = createStackNavigator<MainStackParamList>();
export const MainStack = () => {
    return (
        <Stack.Navigator initialRouteName={`DrawerStack`}
                         detachInactiveScreens={false}
                          screenOptions={{
                              headerShown: false
                          }}>

            <Stack.Screen name={`DrawerStack`}
                           component={DrawerStack}/>

            <Stack.Screen name={`LanguageScreen`}
                           options={{

                           }}
                           component={LanguageScreen}/>

            <Stack.Screen name={`AboutTrainingScreen`}
                           options={{

                           }}
                           component={AboutTrainingScreen}/>

            <Stack.Screen name={`HistoryScreen`}
                           options={{

                           }}
                           component={HistoryScreen}/>
        </Stack.Navigator>
    )
}