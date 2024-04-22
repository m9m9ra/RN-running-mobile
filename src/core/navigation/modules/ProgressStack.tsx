import {createStackNavigator} from "@react-navigation/stack";
import {HomeScreen} from "../../../layers/presentation/screens/HomeScreen";
import {AboutTrainingStack} from "./AboutTrainingStack";
import {HistoryScreen} from "../../../layers/presentation/screens/HistoryScreen";
import {Training} from "../../../layers/domain/entity/Training";


export type ProgressStackParamList = {
    HomeScreen: any,
    AboutTrainingStack: {
        training: Training
    },
    HistoryScreen: any
}

const Stack = createStackNavigator<ProgressStackParamList>()
export const ProgressStack = () => {

    return (
            <Stack.Navigator initialRouteName={`HomeScreen`}
                             screenOptions={{
                                 headerShown: false
                             }}>

                <Stack.Screen name={`HomeScreen`}
                              options={{}}
                              component={HomeScreen}/>

                <Stack.Screen name={`AboutTrainingStack`}
                              options={{}}
                              component={AboutTrainingStack}/>

                <Stack.Screen name={`HistoryScreen`}
                              options={{}}
                              component={HistoryScreen}/>
            </Stack.Navigator>
    )
};