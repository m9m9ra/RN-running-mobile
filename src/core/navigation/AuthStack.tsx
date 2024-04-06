import {createStackNavigator} from "@react-navigation/stack";
import {LockScreen} from "../../layers/presentation/screens/LockScreen";
import {WelcomeScreen} from "../../layers/presentation/screens/WelcomeScreen";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {LoginScreen} from "../../layers/presentation/screens/LoginScreen";
import {AuthScreen} from "../../layers/presentation/screens/AuthScreen";
import {OtpScreen} from "../../layers/presentation/screens/OtpScreen";
import {ForgotScreen} from "../../layers/presentation/screens/ForgotScreen";


export type AuthStackParamList = {
    LockScreen: any,
    WelcomeScreen: any,
    LoginScreen: any,
    AuthScreen: any,
    OtpScreen: any,
    ForgotScreen: any
}

const Stack = createStackNavigator<AuthStackParamList>()
export const AuthStack = () => {

    return (
        <Stack.Navigator initialRouteName={`${process.env.BUILD == `DEVELOPMENT` ? `LockScreen` : `WelcomeScreen`}`}
                         screenOptions={{
                             headerShown: false
                         }}>

            <Stack.Screen name={`LockScreen`}
                          component={LockScreen}/>

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