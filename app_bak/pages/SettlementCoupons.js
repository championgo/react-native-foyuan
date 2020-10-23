import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Image, Text } from 'react-native';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import moment from 'moment';

import { Loading, Touchable } from '../components';
import { theme, pxToDp } from '../utils';

const moneyFormat = '0,0.00';

class SettlementCoupons extends React.Component {
    static navigationOptions = {
        title: '选择优惠券',
    };

    state = {
        coupon_id: ''
    };

    componentDidMount() {
        const { navigation: { state: { params: { coupon } } } } = this.props;
        if (!!coupon.use_coupon) {
            this.setState({
                coupon_id: coupon.use_coupon.id
            });
        }
    }

    /**
     * 选择优惠卷
     * @param {*} item 选择项
     */
    selectCoupon = item => {
        if (!!item && item.status == 0) {
            return;
        };
        const { navigation: { goBack, state: { params: { callback } } } } = this.props;
        let params = '', coupon_id = '';
        if (!!item) {
            const { shop_id, id } = item;
            params = {
                shop_id,
                coupon: id
            };
            coupon_id = id;
        };
        this.setState({
            coupon_id,
        });
        callback(params);
        goBack();
    }

    render() {
        const { navigation: { state: { params: { coupon } } } } = this.props;
        const { coupon_id } = this.state;

        if (!!!coupon) {
            return <Loading />
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Touchable style={styles.header} onPress={() => this.selectCoupon()}>
                        <Text>不使用优惠券</Text>
                        {
                            !!!coupon_id ?
                                <Image
                                    source={require('../images/default.png')}
                                    resizeMode="contain"
                                    style={styles.selectImg}
                                /> :
                                <View style={styles.selectNo}></View>
                        }
                    </Touchable>
                    {
                        coupon.coupons.map((item, index) => <Touchable style={styles.coupons} key={`coupon_${index}_${item.id}`} onPress={() => this.selectCoupon(item)}>
                            <View style={styles.couponsTop}>
                                <View style={styles.couponsTopL}>
                                    <Text style={[styles.couponsTopLT, item.status == 0 ? styles.textDisplay : '']}>{numeral(item.money).format('$0,0.00')}</Text>
                                    <Text style={[styles.couponsTopLB, item.status == 0 ? styles.textDisplay : '']}>满{numeral(item.spend_money).format(moneyFormat)}元可用</Text>
                                </View>
                                <View style={styles.couponsTopM}>
                                    <Text style={[styles.couponsTopMT, item.status == 0 ? styles.textDisplay : '']} numberOfLines={1}>有效期至{moment(item.validtime).format('YYYY-MM-DD')}</Text>
                                    <Text style={[styles.couponsTopMB, item.status == 0 ? styles.textDisplay : '']} numberOfLines={1}>可用范围：{item.platform == 0 ? '全场通用' : '店铺专用'}</Text>
                                </View>
                                <View style={styles.couponsTopR}>
                                    {
                                        item.status == 0 ?
                                            null :
                                            coupon_id == item.id ?
                                                <Image
                                                    source={require('../images/default.png')}
                                                    resizeMode="contain"
                                                    style={styles.selectImg}
                                                /> :
                                                <View style={styles.selectNo}></View>
                                    }
                                </View>
                            </View>
                            {
                                item.status == 1 ?
                                    null :
                                    <View style={styles.couponsBot}>
                                        <Text style={styles.couponsBotText}>不可用原因：{item.reason}</Text>
                                    </View>
                            }
                        </Touchable>)
                    }
                </ScrollView>
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
        flex: 5,
        flexDirection: "column",
        alignItems: "center",
    },
    couponsTopLT: {
        fontSize: pxToDp(60),
        color: "#FF826E",
        fontWeight: "500",
    },
    couponsTopLB: {
        fontSize: pxToDp(18),
        color: "#2E2E2E",
        fontWeight: "500"
    },
    couponsTopM: {
        flexDirection: "column",
        alignItems: "center",
        flex: 6,
    },
    couponsTopMT: {
        fontSize: pxToDp(24),
        color: "#2E2E2E",
        fontWeight: "500",
        marginBottom: pxToDp(10)
    },
    couponsTopMB: {
        fontSize: pxToDp(24),
        color: "#2E2E2E",
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

    },
    textDisplay: {
        color: "#A4A8B0"
    }
});

export default SettlementCoupons;