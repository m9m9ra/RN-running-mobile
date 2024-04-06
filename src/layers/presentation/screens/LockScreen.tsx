import {Image, Linking, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import moment from "moment";
import {useEffect} from "react";
import {Button, Icon, MD2Colors, Text} from "react-native-paper";
import {AuthStackParamList} from "../../../core/navigation/AuthStack";

type props = StackScreenProps<AuthStackParamList, `LockScreen`>;
export const LockScreen = ({navigation, route}: props) => {
    const current = moment(new Date(), "DD MM YYYY");
    const permission = moment('2024-05-31').isBefore(current);

    useEffect(() => {
        console.log(permission);
    }, []);

    return (
            <ScrollView horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.container}>
                <View style={{
                    alignItems: `center`,
                    gap: 8
                }}>
                    <Image style={{
                        height: 300,
                        width: 240
                    }} source={require('./../../../../assets/LogоRU_store.png')}/>
                    <Text children={`0.0.1`} style={{
                        fontSize: 24,
                        fontWeight: '100'
                    }}/>
                    <Text children={`Вы используете тестовую версию приложения,данная версия будет деактивированна \n31/05/2024`}
                          style={{
                              marginBottom: 20,
                              fontWeight: "700",
                              fontSize: 18,
                              textAlign: "center"
                          }}/>
                </View>
                <View style={{
                    marginTop: 40,
                }}>
                    {
                        !permission ?
                                <TouchableWithoutFeedback disabled={false}
                                                          onPress={() => {
                                                              navigation.navigate(`WelcomeScreen`);
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
                                                          children={<Text children={`Start betta`.toUpperCase()}
                                                                          style={{
                                                                              color: `#FFFFFF`,
                                                                              fontSize: 13,
                                                                              letterSpacing: 2.6,
                                                                              fontWeight: `700`
                                                                          }}/>}
                                                          onPress={() => {
                                                              navigation.navigate(`WelcomeScreen`);
                                                          }}/>
                                        <TouchableOpacity disabled={false}
                                                          children={<Icon size={18} source={`arrow-right`}
                                                                          color={`#FFFFFF`}/>}
                                                          onPress={() => {
                                                              navigation.navigate(`WelcomeScreen`);
                                                          }}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                :
                                <Text variant="bodySmall"
                                      children={`Текущая версия устарела, пожалуйста запросите ссылку на новую версию у тех. администратора`}
                                      style={{
                                          textAlign: 'center',
                                          fontSize: 14
                                      }}/>
                    }
                </View>


            </ScrollView>
    )
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 64
    }
});