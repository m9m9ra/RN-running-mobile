import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Appbar, Avatar, Checkbox, Chip, Divider, HelperText, Icon, Text, TextInput} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {useLayoutEffect, useState} from "react";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {DatePickerInput} from "react-native-paper-dates";
import {observer} from "mobx-react-lite"
import {AuthStackParamList} from "../../../core/navigation/AuthStack";
import {useRootStore} from "../shared/store/RootStore";
import {User} from "../../domain/entity/User";
import {colorSchema} from "../../../core/utils/ColorSchema";

interface errorList {
    firstName: boolean,
    lastName: boolean,
    currentGender: boolean,
    email: boolean,
    password: boolean,
    confirmPassword: boolean,
    birthdate: boolean,
    policy: boolean
}

type props = StackScreenProps<AuthStackParamList, `LoginScreen`>;
export const LoginScreen = observer(({navigation, route}: props) => {
    const [confirmPassword, setConfirmPassword] = useState<string>(``);
    const [inputDate, setInputDate] = useState<Date>();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const genderList: Array<string> = [`MALE`, `FEMALE`, `NOT_SAY`];
    const {userStore} = useRootStore();
    const {t} = useTranslation();

    const [user, setUser] = useState<User>({
        firstName: ``,
        lastName: ``,
        gender: ``,
        email: ``,
        password: ``,
        birthdate: ``,
        policy: false
    });

    const [error, setError] = useState<errorList>({
        firstName: false,
        lastName: false,
        currentGender: false,
        email: false,
        password: false,
        confirmPassword: false,
        birthdate: false,
        policy: false
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => {
                return (
                    <Appbar.Header style={{backgroundColor: Colors.lighter}} elevated>
                        <Appbar.BackAction onPress={() => navigation.goBack()}/>
                        <Appbar.Header mode={`small`}
                                       children={<Text children={t(`REGISTRATION`)}
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
        console.log(userStore.user);
        if (userStore.user) {
            setUser(userStore.user);
        }

        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 650)
    }, []);

    const userLogin = async () => {
        console.log(user, confirmPassword);
        let isValid = true;
        const errorValid = Object.keys(error);
        errorValid.forEach((item) => {
            console.log(error[item]);
            error[item] == true ? isValid = false : true;
        })
        if (!isValid && !refreshing) {
            console.log(`Unchanged`);
            return
        }
        console.log(`Valid !`);
        if ((user.password !== confirmPassword) || user.password.length < 6) {
            setError({...error, confirmPassword: true});
        } else {
            setError({...error, confirmPassword: false})
        }
        setRefreshing(true);
        userStore.userRegister(user)
            .then((status) => {
                setRefreshing(false);
                if (status) {
                    console.log(`successfully`);
                } else {
                    console.log(status);
                }
            })
    }

    return (
        <ScrollView horizontal={false}
                    refreshControl={<RefreshControl refreshing={refreshing}
                                                    onRefresh={() => {
                                                        setRefreshing(true);
                                                        setTimeout(() => {
                                                            setRefreshing(false);
                                                        }, 1500)
                                                    }}/>}
                    contentContainerStyle={style.container}>

            <View style={{paddingHorizontal: 24}}>
                <View style={{
                    flexDirection: `row`,
                    alignItems: `center`,
                    gap: 14
                }}>
                    <TouchableOpacity disabled={false}
                                      children={<Avatar.Icon size={90}
                                                             icon={`camera-plus-outline`}
                                                             style={{
                                                                 backgroundColor: colorSchema.secondary
                                                             }}/>}/>

                    <View style={{
                        flexDirection: `column`,
                        flex: 1,
                        gap: (error.firstName || error.lastName) ? 0 : 12
                    }}>
                        <TextInput label={t(`FIRST_NAME`)}
                                   value={user.firstName}
                                   maxLength={12}
                                   onChangeText={(text) => {
                                       setUser({...user, firstName: text});
                                       if (user.firstName.length < 3) {
                                           setError({...error, firstName: true});
                                       } else {
                                           setError({...error, firstName: false});
                                       }
                                   }}
                                   placeholder={t(`FIRST_NAME`)}
                                   placeholderTextColor={`gray`}
                                   mode={`outlined`}
                                   outlineStyle={style.textInput}
                                   style={style.textInput}/>
                        {error.firstName ?
                            <HelperText type="error"
                                        visible={error.firstName}
                                        children={t("ERROR.FIRSTNAME")}/> : false}

                        <TextInput label={t(`LAST_NAME`)}
                                   value={user.lastName}
                                   maxLength={12}
                                   onChangeText={(text) => {
                                       setUser({...user, lastName: text});
                                       if (user.lastName.length < 5) {
                                           setError({...error, lastName: true});
                                       } else {
                                           setError({...error, lastName: false});
                                       }
                                   }}
                                   placeholder={t(`LAST_NAME`)}
                                   placeholderTextColor={`gray`}
                                   mode={`outlined`}
                                   outlineStyle={style.textInput}
                                   style={style.textInput}/>
                        {error.lastName ?
                            <HelperText type="error"
                                        visible={error.lastName}
                                        children={t("ERROR.LASTNAME")}/> : false}
                    </View>
                </View>

                <Divider style={{
                    width: 0,
                    height: 24
                }}/>

                <ScrollView horizontal={true}>
                    {genderList.map((item, index) =>
                        <Chip key={index}
                              mode={"flat"}
                              elevated={true}
                              style={{
                                  ...style.chip,
                                  borderColor: user.gender == item ? `black` : `gray`
                              }}
                              children={<TouchableOpacity children={<Text children={t(item)}
                                                                          onPress={() => {
                                                                              setUser({...user, gender: item});
                                                                              if (user.gender == "") {
                                                                                  setError({
                                                                                      ...error,
                                                                                      currentGender: true
                                                                                  });
                                                                              } else {
                                                                                  setError({
                                                                                      ...error,
                                                                                      currentGender: false
                                                                                  });
                                                                              }
                                                                          }}
                                                                          style={{
                                                                              ...style.chipText,
                                                                              color: user.gender == item ? `black` : `gray`
                                                                          }}/>}/>}/>)}
                </ScrollView>
                {error.currentGender ?
                    <HelperText type="error"
                                visible={error.currentGender}
                                children={t("ERROR.GENDER")}/> : false}


                <Divider style={{
                    marginTop: 12,
                    marginBottom: 24
                }}/>
            </View>


            <View style={{
                paddingHorizontal: 24,
                gap: (error.email || error.password || error.confirmPassword || error.birthdate) ? 6 : 12
            }}>

                <TextInput value={user.email}
                           onChangeText={text => {
                               setUser({...user, email: text});
                               if (user.email.length < 0) {
                                   setError({...error, email: true});
                               } else {
                                   setError({...error, email: false});
                               }
                           }}
                           mode={`outlined`}
                           placeholder={`Email`}
                           label={`Email`}
                           maxLength={40}
                           inputMode={`email`}
                           placeholderTextColor={`gray`}
                           outlineStyle={style.textInput}
                           style={style.textInput}/>
                {error.email ?
                    <HelperText type="error"
                                visible={error.email}
                                children={t("ERROR.EMAIL")}/> : false}

                <TextInput value={user.password}
                           onChangeText={text => {
                               setUser({...user, password: text})
                               if (user.password.length < 10) {
                                   setError({...error, password: true});
                               } else {
                                   setError({...error, password: false});
                               }
                           }}
                           passwordRules={``}
                           mode={`outlined`}
                    // secureTextEntry
                           inputMode={`text`}
                           maxLength={24}
                           label={t(`PASSWORD`)}
                           placeholder={t(`PASSWORD`)}
                           placeholderTextColor={`gray`}
                           outlineStyle={style.textInput}
                           style={style.textInput}/>
                {error.password ?
                    <HelperText type="error"
                                visible={error.password}
                                children={t("ERROR.PASSWORD")}/> : false}

                <TextInput value={confirmPassword}
                           onChangeText={text => {
                               setConfirmPassword(text);
                               if ((user.password !== confirmPassword) && (user.password !== text)) {
                                   setError({...error, confirmPassword: true});
                               } else {
                                   setError({...error, confirmPassword: false});
                               }
                           }}
                           mode={`outlined`}
                    // secureTextEntry
                           inputMode={`text`}
                           maxLength={24}
                           label={t(`CONFIRM_PASSWORD`)}
                           placeholder={t(`CONFIRM_PASSWORD`)}
                           placeholderTextColor={`gray`}
                           outlineStyle={style.textInput}
                           style={style.textInput}/>
                {error.confirmPassword ?
                    <HelperText type="error"
                                visible={error.confirmPassword}
                                children={t("ERROR.CONFIRM_PASSWORD")}/> : false}

                <DatePickerInput locale="en-GB"
                                 label={t(`BIRTHDATE`)}
                                 placeholder={t(`BIRTHDATE`)}
                                 mode={`outlined`}
                                 outlineStyle={style.textInput}
                                 startYear={1960}
                                 animationType={`none`}
                                 presentationStyle={`overFullScreen`}
                                 style={style.textInput}
                                 value={inputDate}
                                 onChange={(d: Date) => {
                                     setUser({...user, birthdate: d.toLocaleDateString("en-GB")});
                                     setInputDate(d);
                                     if (user.birthdate.length < 0) {
                                         setError({...error, birthdate: true});
                                     } else {
                                         setError({...error, birthdate: false});
                                     }
                                 }}
                                 inputMode={`start`}/>
                {error.birthdate ?
                    <HelperText type="error"
                                visible={error.birthdate}
                                children={t("ERROR.BIRTHDATE")}/> : false}

                <View style={{flexDirection: `row`, alignItems: `center`}}>
                    <Checkbox status={user.policy ? 'checked' : 'unchecked'}
                              color={colorSchema.primary}
                              onPress={() => {
                                  setUser({...user, policy: !user.policy})
                                  if (user.policy) {
                                      setError({...error, policy: true});
                                  } else {
                                      setError({...error, policy: false});
                                  }
                              }}/>
                    <Text children={t(`PRIVATE_POLICY_CHECK`)}/>
                </View>
                {error.policy ?
                    <HelperText type="error"
                                visible={error.policy}
                                children={t("ERROR.PRIVATE_POLICY")}/> : false}

                <View style={style.actionContainer}>

                    <TouchableWithoutFeedback disabled={false}
                                              onPress={async () => userLogin()}>
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
                                              onPress={async () => userLogin()}/>
                            <TouchableOpacity disabled={false}
                                              children={<Icon size={18} source={`arrow-right`} color={`#FFFFFF`}/>}
                                              onPress={async () => userLogin()}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{flexDirection: `row`, alignItems: `center`, flexWrap: `wrap`}}>

                        <TouchableOpacity disabled={false}
                                          children={<Text children={`Private policy`}
                                                          style={{
                                                              fontSize: 14,
                                                              fontWeight: `700`,
                                                              letterSpacing: 2,
                                                              textDecorationLine: `underline`,
                                                              textDecorationStyle: `solid`
                                                          }}/>}
                                          onPress={() => userLogin()}
                                          style={{}}/>
                    </View>
                </View>

            </View>

        </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 32
    },
    actionContainer: {
        gap: 14,
        paddingTop: 32
    },
    chip: {
        height: 34,
        borderRadius: 2,
        backgroundColor: "#FFF",
        marginLeft: 6,
        elevation: 3,
        borderColor: `gray`,
        borderWidth: 1
    },
    textInput: {
        borderRadius: 2,
        borderColor: `black`
    },
    chipText: {
        fontSize: 11,
        color: `gray`,
        fontWeight: `500`
    }
});