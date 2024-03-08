import {SafeAreaView, ScrollView, StatusBar, StyleSheet, useColorScheme} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";

export const App = (): JSX.Element => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                       backgroundColor={backgroundStyle.backgroundColor}/>
            <ScrollView contentInsetAdjustmentBehavior="automatic"
                        style={backgroundStyle}>
            </ScrollView>
        </SafeAreaView>
    );
}