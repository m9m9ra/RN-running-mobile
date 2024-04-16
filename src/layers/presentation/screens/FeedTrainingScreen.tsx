import {ScrollView, StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import {Text} from "react-native-paper";

export const FeedTrainingScreen = () => {
    const {t} = useTranslation();

    return (
            <ScrollView horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.container}>
                <Text children={t(`NEW_FUTURE`)}
                      style={{
                          fontSize: 16
                      }}/>
            </ScrollView>
    )
};

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: `center`,
        justifyContent: `center`,
        paddingBottom: 66
    }
});