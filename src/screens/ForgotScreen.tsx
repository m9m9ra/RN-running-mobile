import {ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../navigation/AuthStack";
import {Appbar, Icon, Text, TextInput} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {colorSchema} from "../utils/ColorSchema";
import {useLayoutEffect, useState} from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";

type props = StackScreenProps<AuthStackParamList, `ForgotScreen`>;
export const ForgotScreen = ({navigation, route}: props) => {
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
                                       children={<Text children={t(`RESTORE_PASSWORD`)}
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
                       outlineStyle={{
                           borderRadius: 2,
                           borderWidth: 1,
                           borderColor: `black`
                       }}
                       label={`Email`}
                       inputMode={`email`}
                       style={{}}/>

            <TouchableWithoutFeedback disabled={false}
                                      onPress={() => {
                                          navigation.navigate(`OtpScreen`);
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
                                          navigation.navigate(`OtpScreen`);
                                      }}/>
                    <TouchableOpacity disabled={false}
                                      children={<Icon size={18} source={`arrow-right`} color={`#FFFFFF`}/>}
                                      onPress={() => {
                                          navigation.navigate(`OtpScreen`);
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
                                      navigation.goBack();
                                  }}
                                  style={{}}/>
            </View>
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