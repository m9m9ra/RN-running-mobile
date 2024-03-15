import {StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Icon, Text} from "react-native-paper";
import {useRootStore} from "../store/RootStore";

interface props {
    title: string,
    icon: string,
    label: string
}

export const ProfileCard = ({title, icon, label}: props) => {
    const {userStore} = useRootStore();

    return (
        <TouchableWithoutFeedback disabled={false}
                                  onPress={async () => {
                                      icon == `logout` ? await userStore.userLogout() : false;
                                  }}>
            <View style={style.profileCard}>
                <View style={{flexDirection: `row`, alignItems: `center`, gap: 4}}>
                    <TouchableOpacity children={<Icon size={34}
                                                      color={icon == `logout` ? "#e51200" : `black`}
                                                      source={icon}/>}/>
                    <TouchableOpacity>
                        <View>
                            <Text children={title}
                                  style={{
                                      fontWeight: `700`,
                                      fontSize: 16
                                  }}/>
                            {icon == `logout` ? false : <Text children={label.slice(0, 48)}
                                                              style={{
                                                                  color: `#A7A7A7`,
                                                                  fontSize: 11
                                                              }}/>}

                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity children={<Icon size={24} source={`chevron-right`}/>}/>
            </View>
        </TouchableWithoutFeedback>
    )
};

const style = StyleSheet.create({
    profileCard: {
        backgroundColor: `#FFFFFF`,
        maxHeight: 62,
        paddingHorizontal: 12,
        paddingVertical: 13,
        borderRadius: 2,
        flexDirection: `row`,
        alignItems: `center`,
        justifyContent: `space-between`,
        elevation: 4
    }
});