import {createStackNavigator} from "@react-navigation/stack";

export type AuthStackParamList = {}

const Stack = createStackNavigator<AuthStackParamList>()
export const AuthStack = () => {

    return (
        <Stack.Navigator>

        </Stack.Navigator>
    )
};