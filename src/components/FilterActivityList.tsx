import {useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity} from "react-native";
import {FlatList} from "react-native-gesture-handler"
import {MD3LightTheme, Text} from "react-native-paper";

interface props {
    setFilter: (item: string) => void
}

export const FilterActivityScreen = ({setFilter}: props) => {
    const [selected, setSelected] = useState<number>(0);

    const filterOptions = [
        `DAY`,
        `WEEK`,
        `MONTH`,
        `YEAR`
    ];

    useEffect(() => {
        setFilter(filterOptions[selected]);
    }, []);

    const renderItem = (item: string, index: number) => {
        return (
                <TouchableOpacity disabled={false}
                                  onPress={() => {
                                      setSelected(index);
                                      setFilter(item);
                                  }}
                                  style={{
                                      backgroundColor: selected == index ? MD3LightTheme.colors.primaryContainer : `#FFFFFF`,
                                      paddingVertical: 2,
                                      paddingHorizontal: 24,
                                      borderRadius: 2,
                                      borderWidth: 1,
                                      borderColor: `gray`
                                  }}
                                  children={<Text children={`${item}`}
                                                  style={{
                                                      fontSize: 16,
                                                      fontWeight: `600`
                                                  }}/>}/>
        );
    };

    return (
            <FlatList data={filterOptions}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={style.container}
                      renderItem={item => renderItem(item.item, item.index)}/>
    );
};

const style = StyleSheet.create({
    container: {
        gap: 16
    }
});