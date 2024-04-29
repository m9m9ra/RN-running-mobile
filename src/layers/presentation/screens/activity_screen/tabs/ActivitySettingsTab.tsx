import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ActivityScreenParamList} from "../ActivityScreen";
import {ScrollView, StyleSheet} from "react-native";
import {Text} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {Colors} from "react-native/Libraries/NewAppScreen";

type props = BottomTabScreenProps<ActivityScreenParamList>
export const ActivitySettingsTab = ({navigation, route}: props) => {
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
        backgroundColor: Colors.lighter,
        alignItems: `center`,
        justifyContent: `center`,
        paddingBottom: 120
    }
});