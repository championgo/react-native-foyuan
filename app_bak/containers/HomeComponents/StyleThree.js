import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet } from 'react-native';

import { Touchable } from '../../components';

import { theme, pxToDp } from '../../utils';

class StyleThree extends React.PureComponent {

    render() {
        const { list, goDetail } = this.props;

        return (
            <ScrollView horizontal style={styles.container}>
                {
                    list && list.map((item, index) => {
                        return (
                            <Touchable key={'StyleThreeChild' + item.id} onPress={() => goDetail(item)} style={[styles.item, index >= list.length - 1 ? styles.itemLast : '']}>
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: item.thumb
                                    }}
                                    resizeMode="cover"
                                />
                                <View style={styles.textContainer}>
                                    <View style={styles.textContainerT}>
                                        <Text style={styles.commodityTitle} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.commodityPrice}>¥{item.money}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.commodityDesc} numberOfLines={1}>{item.intro}</Text>
                                    </View>
                                </View>
                            </Touchable>
                        )
                    })
                }
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colorWhite,
    },
    item: {
        maxWidth: pxToDp(620),
        overflow: "hidden",
        marginLeft: pxToDp(40),
        borderRadius: pxToDp(8)
    },
    itemLast: {
        marginRight: pxToDp(40)
    },
    image: {
        width: pxToDp(620),
        height: pxToDp(620)
    },
    textContainer: {
        height: pxToDp(142),
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingVertical: pxToDp(32),
        paddingRight: pxToDp(18),
        paddingLeft: pxToDp(28),
        borderWidth: pxToDp(2),
        borderColor: '#F1F2F3',
        borderTopWidth: 0,
        // borderBottomLeftRadius: pxToDp(8),
        // borderBottomRightRadius: pxToDp(8)
    },
    textContainerT: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    commodityTitle: {
        flex: 1,
        paddingRight: pxToDp(30),
        fontSize: pxToDp(32),
        color: theme.color666,
        fontWeight: '500',
    },
    commodityDesc: {
        fontSize: pxToDp(22),
        color: theme.color999,
    },
    commodityPrice: {
        fontSize: pxToDp(40),
        color: theme.baseColor,
        fontWeight: '500',
    }
});

export default StyleThree;