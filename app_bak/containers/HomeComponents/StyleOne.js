import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Touchable } from '../../components';
import { theme, pxToDp, isOddEven } from '../../utils';

class StyleOne extends React.PureComponent {

    render() {
        const { list, goDetail } = this.props;
        return (
            <View style={styles.container}>
                {
                    list && list.map((item, index) => <Touchable key={'StyleOneChild' + item.id} onPress={() => goDetail(item)} style={[styles.item, isOddEven(index) ? styles.itemPaddingR : styles.itemPaddingL]}>
                        <View style={styles.itemContainer}>
                            <Image
                                style={styles.image}
                                source={{
                                    uri: item.thumb
                                }}
                                resizeMode="cover"
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.commodityTitle} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.commodityDesc} numberOfLines={2}>{item.intro}</Text>
                                <Text style={styles.commodityPrice}><Text style={styles.symbol}>¥</Text>{item.money}</Text>
                            </View>
                        </View>
                    </Touchable>)
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colorWhite,
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: "hidden"
    },
    item: {
        width: '50%',
        marginVertical: pxToDp(16),
    },
    itemContainer: {
        borderWidth: pxToDp(2),
        borderColor: "#f1f2f3",
        borderRadius: pxToDp(8),
    },
    itemPaddingL: {
        paddingLeft: pxToDp(15)
    },
    itemPaddingR: {
        paddingRight: pxToDp(15)
    },
    image: {
        paddingTop: '100%'
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: pxToDp(248),
        overflow: "hidden",
        paddingVertical: pxToDp(24),
        paddingHorizontal: pxToDp(16),
    },
    commodityTitle: {
        fontSize: pxToDp(32),
        color: theme.color333,
        fontWeight: '500',
    },
    commodityDesc: {
        fontSize: pxToDp(22),
        color: theme.color999,
    },
    commodityPrice: {
        fontSize: pxToDp(28),
        color: theme.baseColor,
        fontWeight: '500',
    },
    symbol: {
        fontSize: pxToDp(24),
    }

});

export default StyleOne;