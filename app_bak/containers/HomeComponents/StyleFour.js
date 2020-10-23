import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Touchable, DashLine } from '../../components';
import { theme, pxToDp } from '../../utils';

class StyleFour extends React.PureComponent {

    render() {
        const { list, goDetail } = this.props;

        return (
            <View style={styles.container}>
                {
                    list && list.map((item, index) => <Touchable key={'StyleFourChild' + item.id} onPress={() => goDetail(item)} style={[styles.item]}>
                        <View style={styles.itemContanner}>
                            <Image
                                style={styles.image}
                                source={{
                                    uri: item.thumb
                                }}
                                resizeMode="cover"
                            />
                            <View style={styles.itemR}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.commodityTitle} numberOfLines={2}>{item.name}</Text>
                                    <Text style={styles.commodityDesc} numberOfLines={2}>{item.intro}</Text>
                                    <Text style={styles.commodityPrice}><Text style={styles.symbol}>¥</Text>{item.money}</Text>
                                </View>
                                {
                                    index == list.length - 1 ?
                                        null :
                                        <DashLine color="#f1f2f3" lineWidth={2} borderStyle="solid" />
                                }
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
        width: "100%",
        flexDirection: 'row',
    },
    itemContanner: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: "flex-start",
        alignItems: "center",
    },
    image: {
        width: pxToDp(180),
        height: pxToDp(180),
        borderRadius: pxToDp(8),
        marginRight: pxToDp(24)
    },
    itemR: {
        flex: 1
    },
    textContainer: {
        height: pxToDp(200),
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingVertical: pxToDp(12),
        paddingRight: pxToDp(24),
    },
    commodityTitle: {
        fontSize: pxToDp(32),
        color: theme.color333,
        fontWeight: '500',
        lineHeight: pxToDp(48)
    },
    commodityDesc: {
        fontSize: pxToDp(22),
        color: theme.color999,
        marginTop: pxToDp(-18),
        lineHeight: pxToDp(33)
    },
    commodityPrice: {
        fontSize: pxToDp(32),
        color: theme.baseColor,
        fontWeight: '500',
    },
    symbol: {
        fontSize: pxToDp(32),
        fontWeight: '500',
    }
});

export default StyleFour;