import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Image, Text, Alert, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Textarea, Toast } from "native-base";
import * as wechat from 'react-native-wechat-lib';

import { DashLine, Loading, Touchable, Button } from '../components';
import { theme, pxToDp, NavigationActions, phoneFormat } from '../utils';

class Settlement extends React.Component {

    static navigationOptions = {
        title: '订单支付',
    };

    state = {
        loading: false,
        data: {},
        payLoading: false,
        content: '', // 备注
        payloadStore: {}, // 存储修改条件
        info: [], // 优惠券参数
        deductible_amount: 0, // 礼品卡抵扣金额
        waitPayModalVisible: false, // waitPay modal
    };

    componentDidMount() {
        this.initService();
    }

    /**
     * 初始化请求
     */
    initService = (loading = true, arg, pay) => {
        const { dispatch, navigation: { state: { params } } } = this.props;
        const { payloadStore, content } = this.state;
        const that = this;
        let payload = {};

        if (!!params) {
            payload = { ...params, ...payloadStore, ...arg };
        } else {
            payload = { ...payloadStore, ...arg };
        };

        if (!!pay) {
            payload = { ...payload, ...pay }
        }

        this.setState({
            loading,
            payloadStore: !!pay ? payloadStore : payload
        }, () => {
            dispatch({
                type: 'commodityModel/orderinfo',
                payload: { content, ...payload },
                callback: res => {
                    if (res) {
                        if (res == '支付成功') {
                            that.gotoPaySuccessed();
                        } else {
                            if (!!res.order) {
                                that.wechatPay(res.wxpay);
                            } else {
                                const deductible_amount = Number(res.total - res.need_pay).toFixed(2);
                                this.setState({
                                    loading: false,
                                    data: res,
                                    deductible_amount
                                });
                            }
                        }
                    }
                }
            });
        });
    }

    /**
     * 微信支付
     * @param {*} params 微信支付参数
     */
    wechatPay = wxpay => {
        const that = this;
        wechat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                wechat.pay({
                    partnerId: wxpay.partnerid,
                    prepayId: wxpay.prepayid,
                    nonceStr: wxpay.noncestr,
                    timeStamp: wxpay.timestamp,
                    package: wxpay.package,
                    sign: wxpay.sign,
                }).then(payRes => {
                    if (payRes.errCode == 0) {
                        that.gotoPaySuccessed();
                    } else {
                        that.waitPayModal(true);
                    };
                }).catch(err => {
                    that.waitPayModal(true);
                    // Toast.show({
                    //     text: `支付失败：${JSON.stringify(err)}`,
                    //     position: 'center',
                    //     type: 'danger',
                    //     duration: 3000
                    // });
                });
            } else {
                Platform.OS == 'ios' ?
                    Alert.alert('没有安装微信', '是否安装微信？', [
                        { text: '取消' },
                        { text: '确定', onPress: () => this.waitPay() }
                    ]) :
                    Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
                        { text: '确定' }
                    ])
            }
        });
    }

    /**
     * 等待支付modal
     * @param {*} flag 开关值
     */
    waitPayModal = (flag = false) => {
        this.setState({
            waitPayModalVisible: !!flag
        });
    }

    /**
     * 订单未支付 等待支付提示 知道了
     */
    waitPay = () => {
        const { navigation: { goBack } } = this.props;
        this.waitPayModal();
        goBack();
    }

    /**
     * 安装微信
     */
    installWechat = () => {
        return;
    }

    /**
     * 跳转支付成功
     */
    gotoPaySuccessed = () => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "PaySuccessed" }));
    }

    /**
     * 更换地址
     */
    changeAddress = () => {
        const { dispatch } = this.props;
        const params = {
            type: 1,
            callback: res => {
                this.initService(false, { address_id: res.id });
            }
        };
        dispatch(NavigationActions.navigate({ routeName: 'Address', params }));
    }

    /**
     * 选择优惠卷
     * @param {*} item 选择的商店
     * @param {*} index 选择的商店索引
     */
    choseCoupons = (item, index) => {
        const { dispatch } = this.props;
        const { info } = this.state;
        const params = {
            coupon: item.coupon,
            callback: res => {
                if (!!res) {
                    info[index] = res;
                } else {
                    info[index] = {
                        shop_id: item.shop.id,
                        coupon: ''
                    };
                };
                this.setState({ info }, () => {
                    const { info } = this.state;
                    this.initService(false, { info });
                });

            }
        };
        dispatch(NavigationActions.navigate({ routeName: 'SettlementCoupons', params }));
    }

    /**
     * 选择礼品卡
     */
    choseGiftCards = () => {
        const { dispatch } = this.props;
        const { data } = this.state;
        const params = {
            cards: data.cards,
            callback: res => {
                if (res.length > 0) {
                    this.initService(false, { select_cards: res });
                }
            }
        };
        dispatch(NavigationActions.navigate({ routeName: 'SettlementGiftCards', params }));
    }

    /**
     * 备注
     * @param {*} val 备注信息
     */
    onRemark = val => {
        this.setState({
            content: val
        });
    }

    /**
     * 立即支付
     */
    immediatePayment = () => {
        const { data } = this.state;
        if (data.is_address == 0) {
            Toast.show({
                text: '请完善收货地址',
                position: 'center',
                type: 'warning',
                duration: 1500
            });
            return;
        };

        this.initService(false, {}, { pay_from: 3, step: 'pay', port: 1 });
    }

    render() {
        const { loading, data, payLoading, remark, deductible_amount, waitPayModalVisible } = this.state;

        if (loading) {
            return <Loading />
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {
                        data?.is_address == 1 ?
                            <View style={[styles.address, styles.marginBottom_10]}>
                                <View style={styles.addressL}>
                                    <Text>{data?.address?.name || '无'}</Text>
                                    {
                                        data?.address?.is_default == 1 ?
                                            <Text style={styles.default}>默认</Text> :
                                            null
                                    }
                                </View>
                                <View style={styles.addressR}>
                                    <View style={styles.addressInfo}>
                                        <Text style={styles.marginBottom_20}>{data?.address?.phone ? phoneFormat(data?.address?.phone) : '无'}</Text>
                                        <Text style={styles.marginBottom_20}>{data?.address?.province?.area_name || '无'},&nbsp;{data?.address?.city?.area_name || '无'},&nbsp;{data?.address?.district?.area_name || '无'}</Text>
                                        <Text numberOfLines={2}>{data?.address?.address}</Text>
                                    </View>
                                    <Touchable onPress={() => this.changeAddress()}>
                                        <Text style={styles.change}>更换</Text>
                                    </Touchable>
                                </View>
                            </View> :
                            <Touchable style={[styles.noAddress, styles.marginBottom_10]} onPress={() => this.changeAddress()}>
                                <View style={styles.noAddressL}>
                                    <Image style={styles.iconAddress} resizeMode="contain" source={require('../images/noAddressIcon.png')} />
                                    <Text style={styles.noAddressText}>请选择收货地址</Text>
                                </View>
                                <Image style={styles.iconR} resizeMode="contain" source={require('../images/rightIcon.png')} />
                            </Touchable>
                    }
                    {
                        data?.products?.map((item, index) => {
                            return <View style={[styles.shops, index != data?.products?.length - 1 ? styles.marginBottom_10 : '']} key={`shop_${index}_${item?.shop?.id}`}>
                                <View style={styles.title}>
                                    <Text>{item.shop.title || '无'}</Text>
                                </View>
                                <View style={styles.products}>
                                    {
                                        item.products.map((productItem, productIndex) => {
                                            return <Touchable style={styles.product} key={`product_${index}_${productIndex}_${item.id}`}>
                                                <View
                                                    style={styles.img}
                                                >
                                                    <Image
                                                        style={styles.thumb}
                                                        resizeMode="cover"
                                                        source={{ uri: productItem.thumb }}
                                                    />
                                                </View>
                                                <View style={styles.product_detail}>
                                                    <Text numberOfLines={1} style={styles.product_name}>{productItem.title}</Text>
                                                    <Text numberOfLines={1} style={styles.product_specification}>{productItem.name}</Text>
                                                    <Text style={styles.product_price}>¥{productItem.price}</Text>
                                                </View>
                                                <View style={styles.num}>
                                                    <Text>X{productItem.quantity}</Text>
                                                </View>
                                            </Touchable>
                                        })
                                    }
                                </View>
                                <DashLine color="#F2F2F2" lineWidth={2} borderStyle="solid" />
                                {
                                    item?.coupon.coupons.length <= 0 ?
                                        null :
                                        <>
                                            <Touchable style={styles.coupon} onPress={() => this.choseCoupons(item, index)}>
                                                <Text style={styles.couponL}>优惠券</Text>
                                                {
                                                    item?.coupon?.can_use_coupon == 0 ?
                                                        <View style={styles.couponR}>
                                                            <Text style={[styles.couponR_text, styles.couponR_text_default]}>暂无可用</Text>
                                                            <Image
                                                                style={styles.couponIcon}
                                                                resizeMode="cover"
                                                                source={require('../images/rightIcon.png')}
                                                            />
                                                        </View> :
                                                        <View style={styles.couponR}>
                                                            <Text style={styles.couponR_text}>优惠{item.coupon.use_coupon?.money || 0}元</Text>
                                                            <Image
                                                                style={styles.couponIcon}
                                                                resizeMode="cover"
                                                                source={require('../images/rightIcon.png')}
                                                            />
                                                        </View>
                                                }

                                            </Touchable>
                                            <DashLine color="#F2F2F2" lineWidth={2} borderStyle="solid" />
                                        </>
                                }
                                <View style={styles.subtotal}>
                                    <View style={styles.subtotalItem}>
                                        <Text style={styles.subtotalItemStyle}>商品合计</Text>
                                        <Text style={styles.subtotalItemStyle}>{item.products_money}元</Text>
                                    </View>
                                    {
                                        item.coupon.use_coupon ?
                                            <View style={styles.subtotalItem}>
                                                <Text style={styles.subtotalItemStyle}>优惠券</Text>
                                                <Text style={styles.subtotalItemStyle}>{item.coupon.use_coupon?.money}元</Text>
                                            </View> :
                                            null
                                    }
                                    <View style={styles.subtotalItem}>
                                        <Text style={styles.subtotalItemStyle}>运费</Text>
                                        <Text style={styles.subtotalItemStyle}>{item.express_fee}元</Text>
                                    </View>
                                    <DashLine color="#F2F2F2" lineWidth={2} borderStyle="solid" />
                                    <View style={styles.subtotalFooter}>
                                        <Text style={styles.subtotalItemStyle}>小计：</Text>
                                        <Text style={[styles.subtotalItemStyle, styles.subtotalFooterStyle]}>{item.total}元</Text>
                                    </View>
                                </View>
                            </View>
                        })
                    }
                    <View style={styles.total}>
                        <Text style={styles.subtotalItemStyle}>合计金额：</Text>
                        <Text style={[styles.subtotalItemStyle, styles.subtotalFooterStyle]}>{data?.total}元</Text>
                    </View>
                    {
                        data?.cards?.length > 0 ?
                            <Touchable
                                style={[styles.coupon, styles.paddingHorizontal_40, styles.marginBottom_10]}
                                onPress={() => this.choseGiftCards()}
                            >
                                <Text style={styles.couponL}>礼品卡</Text>
                                <View style={styles.couponR}>
                                    <Text style={styles.couponR_text}>{deductible_amount == 0 ? '请选择' : `抵扣${deductible_amount}元`}</Text>
                                    <Image
                                        style={styles.couponIcon}
                                        resizeMode="cover"
                                        source={require('../images/rightIcon.png')}
                                    />
                                </View>
                            </Touchable> :
                            <Touchable
                                style={[styles.coupon, styles.paddingHorizontal_40, styles.marginBottom_10]}
                            >
                                <Text style={styles.couponL}>礼品卡</Text>
                                <View style={styles.couponR}>
                                    <Text style={[styles.couponR_text, styles.couponR_text_default]}>暂无可用</Text>
                                    <Image
                                        style={styles.couponIcon}
                                        resizeMode="cover"
                                        source={require('../images/rightIcon.png')}
                                    />
                                </View>
                            </Touchable>
                    }
                    <View style={[styles.remark, styles.paddingHorizontal_40]}>
                        <Text style={[styles.remarkTitle, styles.marginBottom_20]}>备注：</Text>
                        <Textarea
                            value={remark}
                            rowSpan={3}
                            bordered
                            placeholder="备注"
                            onChangeText={this.onRemark}
                        />
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <View style={styles.footerL}>
                        <Text style={styles.footerText}>需支付金额：</Text>
                        <Text style={[styles.footerText, styles.footerTextColor2]}>{data?.need_pay}元</Text>
                    </View>
                    <Button
                        text="立即支付"
                        loading={payLoading}
                        style={styles.footerR}
                        textStyle={styles.footerRText}
                        onPress={() => this.immediatePayment()}
                    />
                </View>
                <Modal
                    visible={waitPayModalVisible}
                    animationType="fade"
                    transparent
                >
                    <View style={styles.waitPayModal}>
                        <View style={styles.waitPayModalContainer}>
                            <View style={styles.waitPayModalContainerContent}>
                                <Text style={styles.waitPayModalContainerContentText}>订单已生成，请及时支付哦</Text>
                            </View>
                            <Button
                                text="知道了"
                                style={styles.waitPayModalBtn}
                                textStyle={styles.waitPayModalBtnText}
                                onPress={() => this.waitPay()}
                            />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    address: {
        maxHeight: pxToDp(260),
        flexDirection: "row",
        alignItems: "center",
        padding: pxToDp(30),
        backgroundColor: theme.colorWhite,
        overflow: "hidden"
    },
    addressL: {
        height: '100%',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        paddingRight: pxToDp(40),
        borderRightWidth: pxToDp(2),
        borderColor: "#ECEFF3"
    },
    default: {
        paddingVertical: pxToDp(6),
        paddingHorizontal: pxToDp(12),
        backgroundColor: theme.baseBackgroundColor,
        color: "#a3a8b0",
        fontSize: pxToDp(18),
        borderRadius: pxToDp(4),
        marginTop: pxToDp(10)
    },
    addressR: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addressInfo: {
        flex: 1,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(20)
    },
    change: {
        color: theme.baseColor,
        fontSize: pxToDp(24)
    },
    marginBottom_20: {
        marginBottom: pxToDp(20)
    },
    marginBottom_10: {
        marginBottom: pxToDp(10)
    },
    noAddress: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: pxToDp(40),
        backgroundColor: theme.colorWhite
    },
    noAddressL: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    iconAddress: {
        width: pxToDp(40),
        height: pxToDp(40)
    },
    noAddressText: {
        fontWeight: "500",
        fontSize: pxToDp(30),
        marginLeft: pxToDp(10)
    },
    iconR: {
        width: pxToDp(40),
        height: pxToDp(40)
    },
    shops: {
        paddingHorizontal: pxToDp(40),
        backgroundColor: theme.colorWhite
    },
    title: {
        fontSize: pxToDp(30),
        color: '#2D2D2D',
        fontWeight: "500",
        paddingTop: pxToDp(32),
        paddingBottom: pxToDp(8)
    },
    products: {

    },
    product: {
        paddingVertical: pxToDp(30),
        flexDirection: "row",
        alignItems: "center",
    },
    img: {
        width: pxToDp(120),
        height: pxToDp(120),
        marginRight: pxToDp(30),
        borderRadius: pxToDp(4),
        overflow: "hidden"
    },
    thumb: {
        width: '100%',
        height: "100%",
    },
    product_detail: {
        height: pxToDp(120),
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    product_name: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#2D2D2D"
    },
    product_specification: {
        fontSize: pxToDp(24),
        fontWeight: "500",
        color: "#A3A8B0"
    },
    product_price: {
        fontSize: pxToDp(24),
        fontWeight: "500",
        color: "#2D2D2D"
    },
    num: {
        fontSize: pxToDp(24),
        fontWeight: "500",
        color: "#2D2D2D"
    },
    coupon: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: pxToDp(30),
        backgroundColor: theme.colorWhite
    },
    couponL: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#2D2D2D"
    },
    couponR: {
        flexDirection: "row",
        alignItems: "center",
    },
    couponR_text_default: {
        color: '#a3a8b0'
    },
    couponR_text: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#66BFB8",
        marginRight: pxToDp(20)
    },
    couponIcon: {
        width: pxToDp(13),
        height: pxToDp(22)
    },
    subtotal: {
        paddingVertical: pxToDp(10)
    },
    subtotalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: pxToDp(20)
    },
    subtotalItemStyle: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#2D2D2D"
    },
    subtotalFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingTop: pxToDp(34),
        paddingBottom: pxToDp(33)
    },
    subtotalFooterStyle: {
        color: "#66BFB8"
    },
    total: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingVertical: pxToDp(30),
        paddingHorizontal: pxToDp(40),
        marginVertical: pxToDp(10),
        backgroundColor: theme.colorWhite
    },
    paddingHorizontal_40: {
        paddingHorizontal: pxToDp(40)
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        height: pxToDp(98),
        overflow: "hidden"
    },
    footerL: {
        flex: 1,
        height: "100%",
        backgroundColor: theme.colorWhite,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    footerText: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#2D2D2D"
    },
    footerTextColor2: {
        color: '#66BFB8'
    },
    footerR: {
        flex: 1,
        height: '100%',
        borderRadius: 0
    },
    footerRText: {
        fontSize: pxToDp(30)
    },
    remark: {
        paddingVertical: pxToDp(30),
        backgroundColor: theme.colorWhite
    },
    remarkTitle: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: "#2d2d2d"
    },
    waitPayModal: {
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    waitPayModalContainer: {
        width: "70%",
        backgroundColor: theme.colorWhite,
        borderRadius: pxToDp(20),
        overflow: "hidden"
    },
    waitPayModalContainerContent: {
        paddingHorizontal: pxToDp(40),
        paddingVertical: pxToDp(60),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: theme.color999,
        borderBottomWidth: pxToDp(2)
    },
    waitPayModalContainerContentText: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: theme.color333
    },
    waitPayModalBtn: {
        backgroundColor: theme.colorWhite,
        borderRadius: 0,
    },
    waitPayModalBtnText: {
        fontSize: pxToDp(30),
        fontWeight: "500",
        color: theme.color333
    },
});

export default connect(
    ({
        commodityModel: { ...commodityModel }
    }) => ({
        commodityModel
    })
)(Settlement);
