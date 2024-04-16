import {DrawerStack, DrawerStackParamList} from "./modules/DrawerStack";
import {Settings} from "../../layers/domain/entity/Settings";
import {Training} from "../../layers/domain/entity/Training";
import {createStackNavigator} from "@react-navigation/stack";
import {LanguageScreen} from "../../layers/presentation/screens/LanguageScreen";
import {HistoryScreen} from "../../layers/presentation/screens/HistoryScreen";
import {AboutTrainingStack} from "./modules/AboutTrainingStack";

export type MainStackParamList = {
    DrawerStack: DrawerStackParamList,
    LanguageScreen: Settings | any,
    AboutTrainingStack: {
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
                              options={{}}
                              component={LanguageScreen}/>

                <Stack.Screen name={`AboutTrainingStack`}
                              options={{}}
                              component={AboutTrainingStack}/>

                <Stack.Screen name={`HistoryScreen`}
                              options={{}}
                              component={HistoryScreen}/>
            </Stack.Navigator>
    )
}