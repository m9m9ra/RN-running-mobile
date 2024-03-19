import {ScrollView, StyleSheet, View} from "react-native";
import {Divider, Text, TextInput} from "react-native-paper";
import {observer} from "mobx-react-lite";
import {useServiceProvider} from "../modules/ServicesProvider";

export const HomeScreen = observer(() => {
    const {stepCounter} = useServiceProvider();

    return (
        <ScrollView horizontal={false}
                    contentContainerStyle={style.container}>
            <Text children={`Step: ${stepCounter.stepCount}`}
                  style={{
                      fontSize: 24,
                      fontWeight: `700`,
                      letterSpacing: 2
                  }}/>
            <TextInput label={`text`}
                       mode={`outlined`}/>
            <View style={{height: 600}}/>
            <Divider/>
            <View style={{height: 300}}/>
        </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24
    }
});