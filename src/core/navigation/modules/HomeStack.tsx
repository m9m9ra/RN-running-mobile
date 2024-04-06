import {DrawerScreenProps} from "@react-navigation/drawer";
import {DrawerStackParamList} from "./DrawerStack";
import {BottomTabHeaderProps, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useRootStore} from "../../../layers/presentation/shared/store/RootStore";
import {AppBar} from "../../../layers/presentation/shared/ui/AppBar";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {Icon} from "react-native-paper";
import {colorSchema} from "../../utils/ColorSchema";
import {HomeScreen} from "../../../layers/presentation/screens/HomeScreen";
import {ActivityScreen} from "../../../layers/presentation/screens/ActivityScreen";
import {ProfileScreen} from "../../../layers/presentation/screens/ProfileScreen";


export type HomeStackParamList = {
    HomeScreen: any,
    ActivityScreen: any,
    ProfileScreen: any
}
type props = DrawerScreenProps<DrawerStackParamList, `HomeStack`>;
const Tab = createBottomTabNavigator<HomeStackParamList>()
export const HomeStack = observer(({navigation, route}: props) => {
    const {t} = useTranslation();
    const {settingStore} = useRootStore();

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
                               paddingBottom: 4,
                               backgroundColor: settingStore.them == "DARK" ? Colors.darker : Colors.lighter,
                           },
                           tabBarHideOnKeyboard: true
                       }}>

            <Tab.Screen name={`HomeScreen`}
                        options={{
                            tabBarLabel: t(`DRAWER_MENU.PROGRESS`),
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
                            tabBarLabel: t(`DRAWER_MENU.ACTIVITY`),
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
                            tabBarLabel: t(`DRAWER_MENU.PROFILE`),
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
});