import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Touchable } from '../../components';
import { theme, pxToDp } from '../../utils';

class StyleTwo extends React.PureComponent {

    render() {
        const { list, goDetail } = this.props;

        return (
            <View style={styles.container}>
                {
                    list && list.map((item, index) => <Touchable key={'StyleTwoChild' + item.id} onPress={() => goDetail(item)} style={[styles.item, styles.itemPaddingHorizontal]}>
                        <View>
                            <Image
                                style={styles.image}
                                source={{
                                    uri: item.thumb
                                }}
                                resizeMode="cover"
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.commodityTitle} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.commodityDesc} numberOfLines={1}>{item.intro}</Text>
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
        width: 100 / 3 + '%',
        marginTop: pxToDp(40)
    },
    itemPaddingHorizontal: {
        paddingHorizontal: pxToDp(18),
    },
    image: {
        paddingTop: '100%',
        borderRadius: pxToDp(8)
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: pxToDp(120),
        overflow: "hidden",
        paddingTop: pxToDp(16)
    },
    commodityTitle: {
        fontSize: pxToDp(24),
        color: theme.color333,
        fontWeight: '400',
    },
    commodityDesc: {
        fontSize: pxToDp(20),
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

export default StyleTwo;