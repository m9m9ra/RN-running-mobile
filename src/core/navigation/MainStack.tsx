import {DrawerStack, DrawerStackParamList} from "./modules/DrawerStack";
import {Settings} from "../../layers/domain/entity/Settings";
import {createStackNavigator} from "@react-navigation/stack";
import {LanguageScreen} from "../../layers/presentation/screens/LanguageScreen";
import {TrainingsSettingsScreen} from "../../layers/presentation/screens/settings_screen/TrainingSettingsScreen";

export type MainStackParamList = {
    DrawerStack: DrawerStackParamList,
    LanguageScreen: Settings | any,
    TrainingsSettingsScreen: Settings | any,
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

                <Stack.Screen name={`TrainingsSettingsScreen`}
                              options={{}}
                              component={TrainingsSettingsScreen}/>

            </Stack.Navigator>
    )
}