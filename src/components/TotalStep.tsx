import {Image, StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import {observer} from "mobx-react-lite";
import {useRootStore} from "../store/RootStore";
import {useTranslation} from "react-i18next";

interface props {
    useStore: boolean,
    step?: number
}

export const TotalStep = observer(({useStore = false, step}: props) => {
    const {stepCounter} = useRootStore();
    const {t} = useTranslation();

    return (
            <View style={{
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: `space-between`,
                gap: 12
            }}>
                <View style={{
                    flexDirection: `row`,
                    alignItems: `center`,
                    gap: 22
                }}>
                    <Image source={require(`./../assets/image/footprints.png`)}
                           style={{
                               width: 50,
                               height: 50
                           }}/>
                    <View>
                        <Text children={t(`TOTAL_STEP`)}
                              style={{
                                  color: `gray`,
                                  fontSize: 18,
                                  fontWeight: `700`,
                                  letterSpacing: 2.8
                              }}/>
                        <Text children={`${useStore ? stepCounter.stepCount : step}`}
                              style={{
                                  fontSize: 22,
                                  fontWeight: `700`,
                                  letterSpacing: 2.4
                              }}/>
                    </View>
                </View>

                <CircularProgress value={useStore ? stepCounter.stepCount : step}
                                  title={`10000`}
                                  radius={38}
                                  maxValue={10000}
                                  titleColor="black"
                                  duration={3450}
                                  delay={1}

                                  activeStrokeColor={'#5324fd'}
                                  activeStrokeSecondaryColor={'#C25AFF'}
                                  // activeStrokeColor={(useStore ? stepCounter.stepCount : step) > 5000 ? `#2ecc71` : `#ffa726`}

                                  titleStyle={{fontWeight: `700`}}
                                  activeStrokeWidth={10}
                                  progressValueColor={'black'}/>
            </View>
    )
});

const style = StyleSheet.create({
    container: {}
});