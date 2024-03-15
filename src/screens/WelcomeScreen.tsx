import {Image, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../navigation/AuthStack";
import {Button, Divider, Icon, Text} from "react-native-paper";
import {useTranslation} from "react-i18next";

type props = StackScreenProps<AuthStackParamList, `WelcomeScreen`>;
export const WelcomeScreen = ({navigation, route}: props) => {
    const {t} = useTranslation()

    return (
        <ScrollView contentContainerStyle={style.container}>
            <View style={{paddingHorizontal: 24,}}>
                <View children={<Image source={require(`./../assets/image/run_man.png`)}
                                       style={{
                                           // width: `70%`
                                       }}/>}
                      style={{
                          alignItems: `center`
                      }}/>
                <Text children={`Welcome to `}
                      style={{
                          fontSize: 28,
                          marginTop: 24,
                          fontWeight: `700`
                      }}/>
                <Text children={`Prodman Running`}
                      style={{
                          fontSize: 34,
                          fontWeight: `700`
                      }}/>
            </View>

            <View style={style.actionContainer}>
                <TouchableWithoutFeedback disabled={false}
                                          onPress={() => {
                                              navigation.navigate(`LoginScreen`);
                                          }}>
                    <View style={{
                        backgroundColor: `black`,
                        paddingHorizontal: 9,
                        paddingVertical: 13,
                        flexDirection: `row`,
                        justifyContent: `space-between`,
                        elevation: 4
                    }}>
                        <TouchableOpacity disabled={false}
                                          children={<Text children={t(`START`).toUpperCase()}
                                                          style={{
                                                              color: `#FFFFFF`,
                                                              fontSize: 13,
                                                              letterSpacing: 2.6,
                                                              fontWeight: `700`
                                                          }}/>}
                                          onPress={() => {
                                              navigation.navigate(`LoginScreen`);
                                          }}/>
                        <TouchableOpacity disabled={false}
                                          children={<Icon size={18} source={`arrow-right`} color={`#FFFFFF`}/>}
                                          onPress={() => {
                                              navigation.navigate(`LoginScreen`);
                                          }}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity disabled={false}
                                  children={<Text children={t(`HAVE_ACCOUNT`).toUpperCase()}
                                                  style={{
                                                      fontSize: 14,
                                                      fontWeight: `700`,
                                                      letterSpacing: 2,
                                                      textDecorationLine: `underline`,
                                                      textDecorationStyle: `solid`
                                                  }}/>}
                                  onPress={() => {
                                      navigation.navigate(`AuthScreen`);
                                  }}
                                  style={{}}/>
            </View>
        </ScrollView>
    )
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 32,
        justifyContent: `space-between`
    },
    actionContainer: {
        backgroundColor: `#FFFFFF`,
        gap: 18,
        paddingHorizontal: 24,
        paddingTop: 22,
        paddingBottom: 42
    }
});