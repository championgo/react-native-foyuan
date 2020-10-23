import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Image, Text } from 'react-native';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import moment from 'moment';

import { Button, Touchable } from '../components';
import { theme, pxToDp } from '../utils';

const moneyFormat = '0,0.00';

class SettlementGiftCards extends React.Component {
    static navigationOptions = {
        title: '选择礼品卡',
    };

    state = {
        cards: [],
        isSelect: false,
    };

    componentDidMount() {
        const { navigation: { state: { params: { cards } } } } = this.props;
        this.setState({
            cards
        }, this.checkSelect);
    }

    /**
     * 实时检测选择情况
     */
    checkSelect = () => {
        const { cards } = this.state;
        const select_cards = cards.filter(item => item.is_choose == 1);
        this.setState({
            isSelect: !(select_cards.length > 0)
        });

    }

    /**
     * 选择礼品卡
     * @param {*} item 选择项
     */
    selectCard = item => {
        const { cards } = this.state;
        item.is_choose = item.is_choose == 0 ? 1 : 0;
        this.setState({
            cards
        }, this.checkSelect)
    }

    /**
     * 确定
     */
    define = () => {
        const { navigation: { goBack, state: { params: { callback } } } } = this.props;
        const { cards } = this.state;
        const params = [];
        cards.map(item => {
            if (item.is_choose == 1) {
                params.push(item.id);
            }
        });
        callback(params);
        goBack();
    }

    /**
     * 不使用礼品卡
     */
    noSelect = () => {
        const { cards } = this.state;
        cards.map(item => item.is_choose = 0);
        this.setState({
            cards,
            isSelect: true
        });
    }

    render() {
        const { cards, isSelect } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Touchable style={styles.header} onPress={() => this.noSelect()}>
                        <Text>不使用礼品卡</Text>
                        {
                            isSelect ?
                                <Image
                                    source={require('../images/default.png')}
                                    resizeMode="contain"
                                    style={styles.selectImg}
                                /> :
                                <View style={styles.selectNo}></View>
                        }
                    </Touchable>
                    {
                        cards.map((item, index) => <Touchable style={styles.coupons} key={`card_${index}_${item.card_id}`} onPress={() => this.selectCard(item)}>
                            <View style={styles.couponsTop}>
                                <View style={styles.couponsTopL}>
                                    <Text style={[styles.couponsTopLT]}>{numeral(item.remain_money).format('$0,0.00')}</Text>
                                    <Text style={[styles.couponsTopLB]}>{item.name}</Text>
                                </View>
                                <View style={styles.couponsTopM}>
                                    <Text style={[styles.couponsTopMT]} numberOfLines={1}>有效期至{moment(item.validtime).format('YYYY-MM-DD')}</Text>
                                    <Text style={[styles.couponsTopMB]} numberOfLines={1}>卡号：{item.cardnumber}</Text>
                                </View>
                                <View style={styles.couponsTopR}>
                                    {
                                        item.is_choose == 1 ?
                                            <Image
                                                source={require('../images/default.png')}
                                                resizeMode="contain"
                                                style={styles.selectImg}
                                            /> :
                                            <View style={styles.selectNo}></View>
                                    }
                                </View>
                            </View>
                        </Touchable>)
                    }
                </ScrollView>
                <Button
                    text="确定"
                    textStyle={{
                        fontSize: pxToDp(30),
                        fontWeight: "500",
                        color: "#F7F7F9"
                    }}
                    style={{
                        borderRadius: 0,
                        height: pxToDp(98)
                    }}
                    onPress={() => this.define()}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: pxToDp(33),
        paddingHorizontal: pxToDp(40),
        backgroundColor: theme.colorWhite
    },
    selectImg: {
        width: pxToDp(44),
        height: pxToDp(44)
    },
    selectNo: {
        width: pxToDp(44),
        height: pxToDp(44),
        borderRadius: pxToDp(4),
        borderWidth: pxToDp(2),
        borderColor: "#A3A8B0"
    },
    coupons: {
        paddingVertical: pxToDp(42),
        paddingHorizontal: pxToDp(40),
        backgroundColor: theme.colorWhite,
        marginTop: pxToDp(10)
    },
    couponsTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    couponsTopL: {
        flex: 6,
        flexDirection: "column",
        alignItems: "center",
    },
    couponsTopLT: {
        fontSize: pxToDp(60),
        color: "#FF816D",
        fontWeight: "500",
    },
    couponsTopLB: {
        fontSize: pxToDp(18),
        color: "#2D2D2D",
        fontWeight: "500"
    },
    couponsTopM: {
        flexDirection: "column",
        alignItems: "center",
        flex: 5,
    },
    couponsTopMT: {
        fontSize: pxToDp(24),
        color: "#2D2D2D",
        fontWeight: "500",
        marginBottom: pxToDp(10)
    },
    couponsTopMB: {
        fontSize: pxToDp(24),
        color: "#2D2D2D",
        fontWeight: "500"
    },
    couponsTopR: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    couponsBot: {
        marginTop: pxToDp(40)
    },
    couponsBotText: {
        fontSize: pxToDp(18),
        color: "#FF826E",
        fontWeight: "500"

    }
});

export default SettlementGiftCards;