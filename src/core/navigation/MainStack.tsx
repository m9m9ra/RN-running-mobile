import {DrawerStack, DrawerStackParamList} from "./modules/DrawerStack";
import {Settings} from "../../layers/domain/entity/Settings";
import {Training} from "../../layers/domain/entity/Training";
import {createStackNavigator} from "@react-navigation/stack";
import {LanguageScreen} from "../../layers/presentation/screens/LanguageScreen";
import {AboutTrainingScreen} from "../../layers/presentation/screens/AboutTrainingScreen";
import {HistoryScreen} from "../../layers/presentation/screens/HistoryScreen";

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