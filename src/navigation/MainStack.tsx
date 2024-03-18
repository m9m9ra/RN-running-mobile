import {createStackNavigator} from "@react-navigation/stack";
import {HomeStack, HomeStackParamList} from "./modules/HomeStack";
import {createDrawerNavigator} from "@react-navigation/drawer";

export type MainStackParamList = {
    HomeStack: HomeStackParamList
}

// const Stack = createStackNavigator<MainStackParamList>();
const Drawer = createDrawerNavigator<MainStackParamList>();
export const MainStack = () => {
    return (
        <Drawer.Navigator initialRouteName={`HomeStack`}
                          screenOptions={{
                              swipeEnabled: true,
                              drawerStyle: {
                                  width: 240
                              },
                              headerShown: false,
                              swipeEdgeWidth: 77,
                          }}>
            <Drawer.Screen name={`HomeStack`}
                           component={HomeStack}/>
        </Drawer.Navigator>
    )
}