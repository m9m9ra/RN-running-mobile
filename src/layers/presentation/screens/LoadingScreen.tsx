import {Image, ScrollView, StyleSheet, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {MD3Colors, ProgressBar, Text} from "react-native-paper";

export const LoadingScreen = () => {

    return (
            <ScrollView horizontal={false}
                        contentContainerStyle={style.container}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}>

                <View style={{paddingHorizontal: 24,}}>
                    <View children={<Image source={require(`./../../../../assets/LogоRU_store.png`)}
                                           style={{
                                               // width: `70%`
                                           }}/>}
                          style={{
                              alignItems: `center`
                          }}/>
                    <Text children={`Welcome to `}
                          style={{
                              fontSize: 28,
                              marginTop: 54,
                              fontWeight: `700`
                          }}/>
                    <Text children={`Prodman Running`}
                          style={{
                              fontSize: 34,
                              fontWeight: `700`,
                              marginBottom: 54,
                          }}/>

                    <ProgressBar indeterminate color={MD3Colors.primary0} />
                </View>
            </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 66,
        paddingHorizontal: 24,
        paddingBottom: 84,
        backgroundColor: `#FFFFFF`
    }
})