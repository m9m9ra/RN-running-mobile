import {ScrollView, StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {ProfileCard} from "../shared/ui/ProfileCard";

export const ProfileScreen = observer(() => {
    const {t} = useTranslation();

    return (
        <ScrollView horizontal={false}
                    contentContainerStyle={style.container}>

            <ProfileCard title={t(`LOGOUT`)} icon={`logout`} label={``}/>
        </ScrollView>
    )
});

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 32
    }
});