import {BottomTabHeaderProps, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HomeScreen} from "../../screens/HomeScreen";
import {Icon} from "react-native-paper";
import {colorSchema} from "../../utils/ColorSchema";
import {ProfileScreen} from "../../screens/ProfileScreen";
import {ActivityScreen} from "../../screens/ActivityScreen";
import {AppBar} from "../../components/AppBar";
import {DrawerNavigationOptions, DrawerScreenProps} from "@react-navigation/drawer";
import {MainStackParamList} from "../MainStack";

export type HomeStackParamList = {
    HomeScreen: any,
    ActivityScreen: any,
    ProfileScreen: any
}
type props = DrawerScreenProps<MainStackParamList, `HomeStack`>;
const Tab = createBottomTabNavigator<HomeStackParamList>()
export const HomeStack = ({navigation, route}: props) => {
    return (
        <Tab.Navigator initialRouteName={`ActivityScreen`}
                       sceneContainerStyle={{
                           flex: 1
                       }}
                       screenOptions={{
                           headerShown: true,
                           header: (props: BottomTabHeaderProps) => <AppBar title={props.options.headerTitle}
                                                                            action={() => props.navigation.goBack()}/>,
                           tabBarStyle: {
                               height: 54,
                               paddingBottom: 4
                           },
                           tabBarHideOnKeyboard: true
                       }}>

            <Tab.Screen name={`HomeScreen`}
                        options={{
                            tabBarLabel: `Progress`,
                            headerTitle: `un`,
                            tabBarIcon: (props) => <Icon size={26}
                                                         color={props.focused ? `black` : colorSchema.secondary}
                                                         source={`chart-bar`}/>,
                            tabBarLabelStyle: {
                                fontSize: 13,
                                color: colorSchema.primary
                            }
                        }}
                        component={HomeScreen}/>

            <Tab.Screen name={`ActivityScreen`}
                        options={{
                            tabBarLabel: `Activity`,
                            tabBarIcon: (props) => <Icon size={26}
                                                         color={props.focused ? `black` : colorSchema.secondary}
                                                         source={`lightning-bolt-outline`}/>,
                            tabBarLabelStyle: {
                                fontSize: 13,
                                color: colorSchema.primary
                            }
                        }}
                        component={ActivityScreen}/>

            <Tab.Screen name={`ProfileScreen`}
                        options={{
                            headerTitle: `Profile`,
                            tabBarLabel: `Profile`,
                            tabBarIcon: (props) => <Icon size={26}
                                                         color={props.focused ? `black` : colorSchema.secondary}
                                                         source={`account-circle-outline`}/>,
                            tabBarLabelStyle: {
                                fontSize: 13,
                                color: colorSchema.primary
                            }
                        }}
                        component={ProfileScreen}/>
        </Tab.Navigator>
    )
}