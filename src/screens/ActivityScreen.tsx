import {ScrollView, StyleSheet} from "react-native";

export const ActivityScreen = () => {
    return (
        <ScrollView horizontal={false}
                    contentContainerStyle={style.container}>

        </ScrollView>
    )
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24
    }
});