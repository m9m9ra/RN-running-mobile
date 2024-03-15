import {createStackNavigator} from "@react-navigation/stack";
import {WelcomeScreen} from "../screens/WelcomeScreen";
import {LoginScreen} from "../screens/LoginScreen";
import {AuthScreen} from "../screens/AuthScreen";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {OtpScreen} from "../screens/OtpScreen";
import {ForgotScreen} from "../screens/ForgotScreen";

export type AuthStackParamList = {
    WelcomeScreen: any,
    LoginScreen: any,
    AuthScreen: any,
    OtpScreen: any,
    ForgotScreen: any
}

const Stack = createStackNavigator<AuthStackParamList>()
export const AuthStack = () => {

    return (
        <Stack.Navigator initialRouteName={`WelcomeScreen`}
                         screenOptions={{
                             headerShown: false
                         }}>

            <Stack.Screen name={`WelcomeScreen`}
                          component={WelcomeScreen}/>

            <Stack.Screen name={`LoginScreen`}
                          options={{
                              headerShown: true,
                              title: ``,
                              headerStyle: {
                                  backgroundColor: Colors.lighter
                              }
                          }}
                          component={LoginScreen}/>

            <Stack.Screen name={`AuthScreen`}
                          options={{
                              headerShown: true,
                              title: ``,
                              headerStyle: {
                                  backgroundColor: Colors.lighter
                              }
                          }}
                          component={AuthScreen}/>

            <Stack.Screen name={`OtpScreen`}
                          options={{
                              headerShown: true,
                              title: ``,
                              headerStyle: {
                                  backgroundColor: Colors.lighter
                              }
                          }}
                          component={OtpScreen}/>

            <Stack.Screen name={`ForgotScreen`}
                          options={{
                              headerShown: true,
                              title: ``,
                              headerStyle: {
                                  backgroundColor: Colors.lighter
                              }
                          }}
                          component={ForgotScreen}/>
        </Stack.Navigator>
    )
};