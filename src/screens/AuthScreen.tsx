import {ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../navigation/AuthStack";
import {Appbar, Icon, Text, TextInput} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {colorSchema} from "../utils/ColorSchema";
import {useLayoutEffect, useState} from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";

type props = StackScreenProps<AuthStackParamList, `AuthScreen`>;
export const AuthScreen = ({navigation, route}: props) => {
    const {t} = useTranslation();
    const [email, setEmail] = useState<string>(``);
    const [password, setPassword] = useState<string>(``);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => {
                return (
                    <Appbar.Header style={{backgroundColor: Colors.lighter}} elevated>
                        <Appbar.BackAction onPress={() => navigation.goBack()}/>
                        <Appbar.Header mode={`small`}
                                       children={<Text children={t(`SIGN_IN`)}
                                                       style={{
                                                           width: `80%`,
                                                           fontWeight: `700`,
                                                           letterSpacing: 1,
                                                           textAlign: `center`
                                                       }}/>}
                                       style={{
                                           backgroundColor: Colors.lighter
                                       }}/>
                    </Appbar.Header>
                )
            }
        })
    }, []);

    return (
        <ScrollView contentContainerStyle={style.container}>
            <TextInput value={email}
                       onChangeText={text => setEmail(text)}
                       mode={`outlined`}
                       placeholder={`Email`}
                       label={`Email`}
                       inputMode={`email`}
                       style={{}}/>
            <TextInput value={password}
                       onChangeText={text => setPassword(text)}
                       mode={`outlined`}
                       secureTextEntry
                       inputMode={`text`}
                       label={t(`PASSWORD`)}
                       placeholder={t(`PASSWORD`)}
                       style={{}}/>

            <TouchableWithoutFeedback disabled={false}
                                      onPress={() => {}}>
                <View style={{
                    backgroundColor: colorSchema.primary,
                    paddingHorizontal: 9,
                    paddingVertical: 17,
                    flexDirection: `row`,
                    justifyContent: `space-between`,
                    elevation: 4
                }}>
                    <TouchableOpacity disabled={false}
                                      children={<Text children={t(`SIGN_IN`).toUpperCase()}
                                                      style={{
                                                          color: `#FFFFFF`,
                                                          fontSize: 13,
                                                          letterSpacing: 2.6,
                                                          fontWeight: `700`
                                                      }}/>}
                                      onPress={() => {

                                      }}/>
                    <TouchableOpacity disabled={false}
                                      children={<Icon size={18} source={`arrow-right`} color={`#FFFFFF`}/>}
                                      onPress={() => {

                                      }}/>
                </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity disabled={false}
                              children={<Text children={t(`FORGOT_PASSWORD`).toUpperCase()}
                                              style={{
                                                  fontSize: 14,
                                                  fontWeight: `700`,
                                                  letterSpacing: 2,
                                                  paddingLeft: 2,
                                                  textDecorationLine: `underline`,
                                                  textDecorationStyle: `solid`
                                              }}/>}
                              onPress={() => {
                                  navigation.navigate(`ForgotScreen`);
                              }}
                              style={{}}/>
        </ScrollView>
    )
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 28,
        gap: 26,
        paddingHorizontal: 24
    },
    actionContainer: {
        backgroundColor: `#FFFFFF`,
        gap: 18,
        paddingHorizontal: 24,
        paddingTop: 22,
        paddingBottom: 42
    }
});