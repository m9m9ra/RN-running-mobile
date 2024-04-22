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
import {ProfileScreen} from "../../../layers/presentation/screens/ProfileScreen";
import {ProgressStack, ProgressStackParamList} from "./ProgressStack";
import {ActivityScreen} from "../../../layers/presentation/screens/activity_screen/ActivityScreen";


export type HomeStackParamList = {
    ProgressStack: ProgressStackParamList,
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
                               height: 56,
                               paddingBottom: 8,
                               paddingTop: 4,
                               backgroundColor: settingStore.them == "DARK" ? Colors.darker : Colors.lighter,
                               borderTopWidth: 1,
                               borderTopColor: colorSchema.secondary
                           },
                           tabBarHideOnKeyboard: true
                       }}>

            <Tab.Screen name={`ProgressStack`}
                        options={{
                            tabBarLabel: t(`DRAWER_MENU.PROGRESS`),
                            headerTitle: `un`,
                            headerShown: false,
                            tabBarIcon: (props) => <Icon size={26}
                                                         color={props.focused ? `black` : colorSchema.secondary}
                                                         source={`chart-bar`}/>,
                            tabBarLabelStyle: {
                                fontSize: 13,
                                color: colorSchema.primary
                            }
                        }}
                        component={ProgressStack}/>

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
                            headerTitle: `${t(`DRAWER_MENU.PROFILE`)}`,
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