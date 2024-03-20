import {createStackNavigator} from "@react-navigation/stack";
import {HomeStack, HomeStackParamList} from "./modules/HomeStack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";

export type MainStackParamList = {
    HomeStack: HomeStackParamList
}

// const Stack = createStackNavigator<MainStackParamList>();
const Drawer = createDrawerNavigator<MainStackParamList>();
export const MainStack = () => {
    return (
        <Drawer.Navigator initialRouteName={`HomeStack`}
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
                               const routeName = getFocusedRouteNameFromRoute(route) ?? 'ActivityScreen'
                               if (routeName == "ActivityScreen" || routeName == `ProfileScreen`)
                                   return ({swipeEnabled: false})
                               else
                                   return ({swipeEnabled: true})
                           }}
                           component={HomeStack}/>
        </Drawer.Navigator>
    )
}