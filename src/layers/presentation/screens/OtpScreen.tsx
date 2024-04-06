import {ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack"
import {Icon, Text, TextInput} from "react-native-paper";
import React, {useLayoutEffect, useState} from "react";
import OtpInputs from "react-native-otp-inputs";
import {AuthStackParamList} from "../../../core/navigation/AuthStack";
import {useTranslation} from "react-i18next";
import {AppBar} from "../shared/ui/AppBar";
import {colorSchema} from "../../../core/utils/ColorSchema";

type props = StackScreenProps<AuthStackParamList, `OtpScreen`>;
export const OtpScreen = ({navigation, route}: props) => {
    const {t} = useTranslation();
    const [email, setEmail] = useState<string>(``);
    const [password, setPassword] = useState<string>(``);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: props => {
                return <AppBar title={``} action={() => navigation.goBack()}/>
            }
        })
    }, []);

    return (
        <ScrollView contentContainerStyle={style.container}>
            <View style={{
                alignItems: `center`,
                marginVertical: 8
            }}>
                <OtpInputs handleChange={(code) => console.log(code)}
                           cursorColor={`black`}
                           placeholder={`0`}
                           placeholderTextColor={`gray`}
                           style={{
                               flexDirection: `row`,
                               color: `black`,
                               gap: 14
                           }}
                           inputStyles={{
                               color: `black`,
                               fontSize: 24,
                               borderWidth: 1,
                               padding: 10,
                               borderRadius: 2,
                               borderColor: `gray`
                           }}
                           keyboardType={`phone-pad`}
                           autofillFromClipboard
                           numberOfInputs={6}/>
            </View>

            <TouchableWithoutFeedback disabled={false}
                                      onPress={() => {
                                      }}>
                <View style={{
                    backgroundColor: colorSchema.primary,
                    paddingHorizontal: 9,
                    paddingVertical: 17,
                    flexDirection: `row`,
                    justifyContent: `space-between`,
                    elevation: 4
                }}>
                    <TouchableOpacity disabled={false}
                                      children={<Text children={t(`RESTORE_PASSWORD`).toUpperCase()}
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
            <View style={{flexDirection: `row`, alignItems: `center`, gap: 8}}>
                <Text children={t(`REMEMBER_PASSWORD`)}/>
                <TouchableOpacity disabled={false}
                                  children={<Text children={t(`SIGN_IN`).toUpperCase()}
                                                  style={{
                                                      fontSize: 14,
                                                      fontWeight: `700`,
                                                      letterSpacing: 2,
                                                      paddingLeft: 2,
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
        paddingTop: 34,
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