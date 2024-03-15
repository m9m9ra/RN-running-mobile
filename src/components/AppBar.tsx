import {Colors} from "react-native/Libraries/NewAppScreen";
import {Appbar, Text} from "react-native-paper";

interface props {
    action: () => void,
    title: string
}

export const AppBar = ({action, title}) => {
    return (
        <Appbar.Header style={{backgroundColor: Colors.lighter}} elevated>
            <Appbar.BackAction onPress={() => action()}/>
            <Appbar.Header mode={`small`}
                           children={<Text children={title}
                                           style={{
                                               width: `80%`,
                                               fontWeight: `700`,
                                               letterSpacing: 1,
                                               textAlign: `center`
                                           }}/>}
                           style={{
                               backgroundColor: Colors.lighter
                           }}/>
        </Appbar.Header>
    )
}