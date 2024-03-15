import {ScrollView, StyleSheet, View} from "react-native";
import {Divider, TextInput} from "react-native-paper";

export const HomeScreen = () => {
    return (
        <ScrollView horizontal={false}
                    contentContainerStyle={style.container}>
            <TextInput label={`text`}
                       mode={`outlined`}/>
            <View style={{height: 600}}/>
            <Divider/>
            <View style={{height: 300}}/>
        </ScrollView>
    )
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24
    }
});