import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Appbar, Icon, Text, TextInput} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {useLayoutEffect, useState} from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {observer} from "mobx-react-lite";
import {AuthStackParamList} from "../../../core/navigation/AuthStack";
import {useRootStore} from "../shared/store/RootStore";
import {colorSchema} from "../../../core/utils/ColorSchema";


type props = StackScreenProps<AuthStackParamList, `AuthScreen`>;
export const AuthScreen = observer(({navigation, route}: props) => {
    const {userStore} = useRootStore();
    const {t} = useTranslation();
    const [email, setEmail] = useState<string>(userStore.user ? userStore.user.email : ``);
    const [password, setPassword] = useState<string>(``);
    const [refreshing, setRefreshing] = useState<boolean>(false);


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
        });
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 550)
    }, []);

    const userAuth = async () => {
        setRefreshing(true)
        await userStore.userAuth(password, email)
                .then(() => {
                    setRefreshing(false);
                })
    };

    return (
        <ScrollView contentContainerStyle={style.container}
                    refreshControl={<RefreshControl refreshing={refreshing}
                                                    onRefresh={() => {}}/>}>
            <TextInput value={email}
                       disabled={refreshing}
                       onChangeText={text => setEmail(text)}
                       mode={`outlined`}
                       placeholder={`Email`}
                       label={`Email`}
                       inputMode={`email`}
                       style={{}}/>
            <TextInput value={password}
                       disabled={refreshing}
                       onChangeText={text => setPassword(text)}
                       mode={`outlined`}
                       secureTextEntry
                       inputMode={`text`}
                       label={t(`PASSWORD`)}
                       placeholder={t(`PASSWORD`)}
                       style={{}}/>

            <TouchableWithoutFeedback disabled={refreshing}
                                      onPress={userAuth}>
                <View style={{
                    backgroundColor: colorSchema.primary,
                    paddingHorizontal: 9,
                    paddingVertical: 17,
                    flexDirection: `row`,
                    justifyContent: `space-between`,
                    elevation: 4
                }}>
                    <TouchableOpacity disabled={refreshing}
                                      children={<Text children={t(`SIGN_IN`).toUpperCase()}
                                                      style={{
                                                          color: `#FFFFFF`,
                                                          fontSize: 13,
                                                          letterSpacing: 2.6,
                                                          fontWeight: `700`
                                                      }}/>}
                                      onPress={userAuth}/>
                    <TouchableOpacity disabled={refreshing}
                                      children={<Icon size={18} source={`arrow-right`} color={`#FFFFFF`}/>}
                                      onPress={userAuth}/>
                </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity disabled={refreshing}
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
});

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