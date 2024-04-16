import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {AboutTrainingScreen} from "../../../layers/presentation/screens/AboutTrainingScreen";
import {StackHeaderProps, StackScreenProps} from "@react-navigation/stack";
import {MainStackParamList} from "../MainStack";
import {Training} from "../../../layers/domain/entity/Training";
import {FeedTrainingScreen} from "../../../layers/presentation/screens/FeedTrainingScreen";
import {ResultTrainingScreen} from "../../../layers/presentation/screens/ResultTrainingScreen";
import {useLayoutEffect} from "react";
import {BottomTabHeaderProps} from "@react-navigation/bottom-tabs";
import {Appbar, Icon, Text} from "react-native-paper";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {TouchableOpacity, View} from "react-native";
import {shareScreen} from "../../utils/ShareScreen";
import {useTranslation} from "react-i18next";
import {colorSchema} from "../../utils/ColorSchema";

export type AboutTrainingStackParamList = {
    AboutTrainingScreen: {
        training: Training
    },
    FeedTrainingScreen: any,
    ResultTrainingScreen: any
}

type props = StackScreenProps<MainStackParamList, `AboutTrainingStack`>;
const Tab = createMaterialTopTabNavigator<AboutTrainingStackParamList>();
export const AboutTrainingStack = ({navigation, route}: props) => {
    const {t} = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (props: StackHeaderProps) => {

                return (
                        <Appbar.Header
                                       style={{
                                           backgroundColor: Colors.lighter,
                                           justifyContent: `space-between`
                                       }}>
                            <View style={{
                                flexDirection: `row`,
                                alignItems: `center`,
                                paddingLeft: 12
                            }}>
                                <TouchableOpacity disabled={false}
                                                  onPress={() => {
                                                      navigation.goBack();
                                                  }}
                                                  style={{
                                                      marginRight: 12
                                                  }}
                                                  children={<Icon size={28}
                                                                  source={"arrow-left"}/>}/>
                                <Appbar.Header mode={`small`}
                                               children={<Text
                                                       children={`${t(`TRAINING_RESULT`)}: ${route.params.training.data}`}
                                                       style={{
                                                           fontWeight: `700`,
                                                           letterSpacing: 1,
                                                           textAlign: `center`
                                                       }}/>}
                                               style={{
                                                   backgroundColor: Colors.lighter
                                               }}/>
                            </View>
                            <View style={{
                                flexDirection: `row`,
                                alignItems: `center`,
                                paddingRight: 12,
                                gap: 8
                            }}>
                                <TouchableOpacity disabled={true}
                                                  onPress={() => shareScreen()}
                                                  children={<Icon size={22}
                                                                  source={`share-variant`}/>}/>

                                <TouchableOpacity disabled={false}
                                                  children={<Icon size={26}
                                                                  source={`dots-vertical`}/>}/>
                            </View>
                        </Appbar.Header>
                )
            }
        });
    }, []);

    return (
            <Tab.Navigator initialRouteName={`AboutTrainingScreen`}
                           screenOptions={{
                               tabBarStyle: {
                                   height: 50,
                                   backgroundColor: Colors.lighter,
                               },
                               tabBarIndicatorStyle: {
                                   backgroundColor: colorSchema.secondary,
                                   height: 3
                               },
                               swipeEnabled: false,
                               tabBarScrollEnabled: false,
                               animationEnabled: false
                           }}>
                <Tab.Screen name={`AboutTrainingScreen`}
                            initialParams={{
                                training: route.params.training
                            }}
                            options={{
                                tabBarShowLabel: false,
                                tabBarIcon: () => {
                                    return (
                                            <Icon size={28}
                                                  source={`map-outline`}/>
                                    )
                                }
                            }}
                            component={AboutTrainingScreen}/>

                <Tab.Screen name={`FeedTrainingScreen`}
                            options={{
                                tabBarShowLabel: false,
                                tabBarIcon: () => {
                                    return (
                                            <Icon size={28}
                                                  source={`image-outline`}/>
                                    )
                                }
                            }}
                            component={FeedTrainingScreen}/>

                <Tab.Screen name={`ResultTrainingScreen`}
                            options={{
                                tabBarShowLabel: false,
                                tabBarIcon: () => {
                                    return (
                                            <Icon size={28}
                                                  source={`chart-box-outline`}/>
                                    )
                                }
                            }}
                            component={ResultTrainingScreen}/>
            </Tab.Navigator>
    )
}