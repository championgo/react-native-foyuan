import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, Alert, Linking, DeviceEventEmitter, PermissionsAndroid } from 'react-native';
import { connect } from 'react-redux';
import CameraRoll from "@react-native-community/cameraroll";
import * as wechat from 'react-native-wechat-lib';
import { NavigationActions, pxToDp, theme } from '../utils';
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import Toast from 'react-native-tiny-toast';
const moneyFormat = '0,0.00';
import RNFS from 'react-native-fs';
import Config from '../config';
const apiDomain = Config[Config.dev].apiDomain;

class Orderdetails extends Component {
    static navigationOptions = {
        title: '订单详情',
    }
    constructor(props) {
        super(props);
        this.state = {
            Orderdtail: '',
            meauListLoad: true,
            orderid: '',
            tabIndex: 0,
            photo: 'tel:13914259886'
        }
    }
    componentDidMount() {
        this.initServe()
    }
    initServe = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        dispatch({
            type: 'Mine/orderdetails',
            payload: {
                id
            },
            callback: (res) => {
                if (res.error == 0) {
                    this.setState({
                        orderid: id,
                        Orderdtail: res.data,
                        meauListLoad: false
                    })
                }
            },
        });
    }
    /**
     * 订单状态组件
     * @param {*} status 订单状态
     */
    OrderStatus = status => {
        switch (status) {
            case 0:
                return <Text style={[styles.orderstate]}>待付款</Text>;
            case 1:
                return <Text style={[styles.orderstate]}>待发货</Text>;
            case 2:
                return <Text style={[styles.orderstate]}>待收货</Text>;
            case 3:
                return <Text style={[styles.orderstate]}>待评价</Text>;
            case 4:
                return <Text style={[styles.orderstate]}>已评价</Text>;
            case 5:
                return <Text style={[styles.orderstate]}>已结算</Text>;
            default:
                return <Text style={[styles.orderstate]}>已取消</Text>;
        }
    }
    // 订单类型
    Ordersituation = (status, item) => {
        switch (status) {
            case 0:
                return (
                    <View style={styles.orderoperationno}>
                        <Text style={styles.orderoperationsituation} onPress={this.Cancelorder}>取消订单</Text>
                    </View>
                )
            case 1:
                return (
                    item.is_return == 1 && item.return_money != 0 ?
                        <View style={styles.orderoperationno}>
                            <Text style={styles.orderoperationsituationorjin} onPress={() => this.AftersalesProcess(item)}>售后进度</Text>
                        </View>
                        :
                        <View style={styles.orderoperationno}>
                            {
                                item.product.length >= 2 ? null :
                                    <Text style={styles.orderoperationsituationor} onPress={() => this.Aftersale(item)}>退换售后</Text>
                            }
                        </View>
                )
            case 2:
                return (
                    item.product[0].is_return == 1 && item.product[0].return_money != 0 ?
                        <View style={styles.orderoperationno}>
                            <View>
                                {
                                    item.product.length >= 2 ?
                                        null :
                                        <Text style={styles.orderoperationsituationorjin} onPress={() => this.AftersalesProces(item)}>售后进度</Text>
                                }
                            </View>
                            <View style={{ marginLeft: pxToDp(30) }}>
                                <Text style={styles.orderoperationsituationor} onPress={() => this.TrackingLogistics(item)}>追踪物流</Text>
                            </View>
                        </View>
                        :
                        <View style={styles.orderoperationno}>
                            <View>
                                {
                                    item.product.length >= 2 ?
                                        null :
                                        <Text style={styles.orderoperationsituationor} onPress={() => this.ReceivingAftersale(item)}>退换售后</Text>
                                }
                            </View>
                            <View style={{ marginLeft: pxToDp(30) }}>
                                <Text style={styles.orderoperationsituationor} onPress={() => this.TrackingLogistics(item)}>追踪物流</Text>
                            </View>
                        </View>
                )
            case 3:
                return (
                    <View style={styles.orderoperationno}>
                        {
                            item.product.length > 1 ?
                                null :
                                <View style={{ marginRight: pxToDp(30) }}>
                                    {
                                        item.return_money != 0 ?
                                            <Text style={styles.orderoperationsituationorjin} onPress={() => this.AftersalesProce(item)}>售后进度</Text>
                                            :
                                            <Text style={styles.orderoperationsituationor} onPress={() => this.ReceivingAftersale(item)}>退换售后</Text>
                                    }
                                </View>
                        }
                        <View style={{ marginRight: pxToDp(30) }}>
                            <Text style={styles.orderoperationsituationor} onPress={() => this.TrackingLogistics(item)}>追踪物流</Text>
                        </View>
                        <View>
                            <Text style={styles.orderoperationsituationor} onPress={() => this.Evaluate(item)}>我要评价</Text>
                        </View>
                    </View>
                )
            case 4:
                return (
                    <View>
                        <View style={styles.orderoperationno}>
                            <View style={{ marginRight: pxToDp(30) }}>
                                <Text style={styles.orderoperationsituation} onPress={() => this.Deleteorder()}>删除订单</Text>
                            </View>
                            <View style={{ marginRight: pxToDp(30) }}>
                                <Text style={styles.orderoperationsituation}>已评价</Text>
                            </View>
                            <View>
                                <Text style={styles.orderoperationsituationor} onPress={() => this.TrackingLogistics(item)}> 追踪物流</Text>
                            </View>
                        </View>
                    </View>
                )
            case 5:
                return (
                    <View style={styles.orderoperationno}>
                        <Text style={styles.orderoperationsituation}>已结算</Text>
                    </View>
                )
            default:
                return (
                    <View style={styles.orderoperationno}>
                        <Text style={styles.orderoperationsituation} onPress={() => this.Deleteorder()}>删除订单</Text>
                    </View>
                )
        }
    }
    Applysale = (item) => {
        if (this.state.Orderdtail?.product.length > 1) {
            return (
                item.status == 2 || item.status == 3 || item.status == -2 ?
                    <View style={styles.orderoperation}>
                        {
                            item.is_return == 1 && item.return_money != 0 || null ?
                                <Text style={styles.orderoperationsituationorjin} onPress={() => this.Progress(item)}>售后进度</Text>
                                :
                                <Text style={styles.orderoperationsituationor} onPress={() => this.ReceivingAftersal(item)}>退换售后</Text>
                        }
                    </View>
                    : null
            )
        }
    }
    // 删除取消订单
    Deleteorder = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        Alert.alert('', '您确定要删除此订单',
            [
                { text: "否" },
                {
                    text: "是", onPress: () => {
                        dispatch({
                            type: "Mine/nopaydelete",
                            payload: {
                                id
                            },
                            callback: res => {
                                if (res) {
                                    Toast.show('已删除此订单', {
                                        position: 0,
                                        duration: 3000
                                    })
                                    this.props.navigation.goBack()
                                    this.props.navigation.state.params.refresh();
                                }
                            }
                        })
                    }
                }
            ]
        )
    }

    // 取消订单
    Cancelorder = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        Alert.alert('', '您确定要取消此订单',
            [
                { text: "否" },
                {
                    text: "是", onPress: () => {
                        dispatch({
                            type: "Mine/cancelManual",
                            payload: {
                                id
                            },
                            callback: res => {
                                if (res) {
                                    this.initServe()
                                    DeviceEventEmitter.emit('Cancelorder', true);
                                }
                            }
                        })
                    }
                }
            ]
        )
    }
    // 退换售后
    Aftersale = (item) => {
        item.refresh = () => {
            this.initServe()
        }
        this.props.dispatch(NavigationActions.navigate({ routeName: 'Aftersale', params: item }))
    }
    //单个商品待收货，待评价退换售后
    ReceivingAftersale = (item) => {
        item.product[0].refresh = () => {
            this.initServe()
        }
        this.props.dispatch(NavigationActions.navigate({ routeName: 'ReceivingAftersale', params: item.product[0] }))
    }
    //多个商品待收货，待评价退换售后
    ReceivingAftersal = (item) => {
        item.refresh = () => {
            this.initServe()
        }
        this.props.dispatch(NavigationActions.navigate({ routeName: 'ReceivingAftersale', params: item }))
    }
    // 我要评价
    Evaluate = (item) => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'Evaluate', params: item }))
    }
    // 单个售后进程
    AftersalesProcess = (item) => {
        item.product[0].type = 0
        this.props.dispatch(NavigationActions.navigate({ routeName: 'AftersalesProcess', params: item.product[0] }))
    }
    // 单个售后进程
    AftersalesProces = (item) => {
        item.product[0].type = 1
        this.props.dispatch(NavigationActions.navigate({ routeName: 'AftersalesProcess', params: item.product[0] }))
    }
    //待评价售后进程
    AftersalesProce = (item) => {
        item.product[0].type = 1
        this.props.dispatch(NavigationActions.navigate({ routeName: 'AftersalesProcess', params: item.product[0] }))
    }
    //多个售后进度
    Progress = (item) => {
        item.type = 1
        this.props.dispatch(NavigationActions.navigate({ routeName: 'AftersalesProcess', params: item }))
    }
    // 追踪物流
    TrackingLogistics = (item) => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'TrackingLogistics', params: item }))
    }
    // 联系客服
    Customer = () => {
        if (this.state.tabIndex == 0) {
            this.setState({
                tabIndex: 1
            })
        } else {
            this.setState({
                tabIndex: 0
            })
        }
    }
    Colsecustomer = () => {
        this.setState({
            tabIndex: 0
        })
    }
    // 打电话联系客服
    Tel = () => {
        Linking.canOpenURL(this.state.photo).then(supported => {
            if (supported) {
                return Linking.openURL(this.state.photo);
            } else {
                Toast.show('该设备不支持电话功能', {
                    position: 0,
                    duration: 3000
                });
            }
        })
    }
    // 再次购买
    Buyagain = (con) => {
        const { dispatch } = this.props;
        dispatch({
            type: "Mine/orderBuyAgain",
            payload: {
                id: con.id
            },
            callback: res => {
                if (res) {
                    DeviceEventEmitter.emit('buyAgain', true);
                    dispatch(NavigationActions.navigate({ routeName: 'ShoppingCart' }));
                }
            }
        })
    }
    // 立即付款
    Immediate = (item) => {
        const { dispatch } = this.props;
        const that = this;

        wechat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                dispatch({
                    type: "Mine/orderPay",
                    payload: {
                        order_id: item.id,
                        pay_from: 3
                    },
                    callback: res => {
                        if (res) {
                            wechat.pay({
                                partnerId: res.wxpay.partnerid,
                                prepayId: res.wxpay.prepayid,
                                nonceStr: res.wxpay.noncestr,
                                timeStamp: res.wxpay.timestamp,
                                package: res.wxpay.package,
                                sign: res.wxpay.sign,
                            }).then(payRes => {
                                if (payRes.errCode == 0) {
                                    that.gotoPaySuccessed();
                                } else {
                                    if (Config.dev === 'production') {
                                        Toast.show(`请及时支付哦！`, {
                                            position: 0,
                                            duration: 3000
                                        });
                                    } else {
                                        Toast.show(`支付失败：${JSON.stringify(payRes.errStr)}`, {
                                            position: 0,
                                            duration: 3000
                                        });
                                    }
                                };
                            }).catch(err => {
                                if (Config.dev === 'production') {
                                    Toast.show(`请及时支付哦！`, {
                                        position: 0,
                                        duration: 3000
                                    });
                                } else {
                                    Toast.show(`支付失败：${JSON.stringify(err)}`, {
                                        position: 0,
                                        duration: 3000
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                Platform.OS == 'ios' ?
                    Alert.alert('没有安装微信', '是否安装微信？', [
                        { text: '取消' },
                        { text: '确定', onPress: () => this.installWechat() }
                    ]) :
                    Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
                        { text: '确定' }
                    ])
            }
        });
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
        product_sku_id
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "PaySuccessed" }));
    }
    Commodity = (item) => {
        item.id = item.product_sku_id
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }))
    }
    // 保存客服二维吗
    saveConfirm = () => {
        Alert.alert('提示  ', '确定保存照片到相册？',
            [
                {
                    text: " 取消", onPress: () => {
                        return
                    }
                },
                {
                    text: "确定", onPress: () => {
                        if (Platform.OS === 'ios') {
                            this.saveImg()
                        } else {
                            this.saveImgInAndroid()
                        }
                    }
                },
            ]
        )
    }
    /**
     * 检测Android权限
     */
    hasAndroidPermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    /**
     * ios保存图片
     */
    saveImg = async () => {
        const prefix = 'assets-library';
        const uri = await CameraRoll.save(`${apiDomain}weixin/assets/imgs/kefu.png`, 'photo');
        if (uri && uri.indexOf(prefix) === 0) {
            Toast.show('图片已保存至相册', {
                position: 0,
                duration: 2000,
            });
        } else {
            Toast.show('保存失败', {
                position: 0,
                duration: 2000,
            });
        };
    }

    /**
     * 安卓保存图片
     */
    saveImgInAndroid = async () => {
        if (Platform.OS === "android" && !(await this.hasAndroidPermission())) {
            return;
        };
        const storeLocation = `${RNFS.ExternalDirectoryPath}`; //安卓ExternalDirectoryPath才是挂载的外置存储，可被用户随意查看
        let pathName = new Date().getTime() + "_kefu.png";
        let downloadDest = `${storeLocation}/${pathName}`;
        const ret = RNFS.downloadFile({ fromUrl: `${apiDomain}weixin/assets/imgs/kefu.png`, toFile: downloadDest });
        ret.promise.then(res => {
            if (res && res.statusCode == 200) {
                CameraRoll.save(`file://${downloadDest}`, 'photo')
                    .then(function (result) {
                        Toast.show('图片已保存至相册', {
                            position: 0,
                            duration: 2000,
                        });
                    }).catch(function (error) {
                        Toast.show('保存失败', {
                            position: 0,
                            duration: 2000,
                        });
                    });
            }
        });
    }
    render() {
        const { Orderdtail, meauListLoad } = this.state;
        if (meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <View style={styles.myorder}>
                            <Text style={styles.ordernumber}>店铺名称：{Orderdtail?.shop?.title}</Text>
                            {this.OrderStatus(Orderdtail?.status)}
                        </View>
                        <View style={{ width: "100%", height: pxToDp(10), backgroundColor: theme.baseBackgroundColor }}></View>
                        <View style={styles.orderaddress}>
                            <View style={styles.addresspic}>
                                <Image style={styles.addressimage} source={require('../images/noAddressIcon.png')}></Image>
                            </View>
                            <View style={styles.orderaddressinformation}>
                                <View style={styles.myinformation}>
                                    <Text style={styles.addressname}>{Orderdtail?.address?.user_name}</Text>
                                    <Text style={styles.ddressphoto}>{Orderdtail?.address?.user_phone.slice(0, 3) + "****" + Orderdtail?.address?.user_phone.slice(7, 11)}</Text>
                                </View>
                                <View style={styles.myaddress}>
                                    <Text style={styles.addressinformation}>{Orderdtail?.address?.province}{Orderdtail?.address?.city}{Orderdtail?.address?.district}{Orderdtail?.address?.user_address}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: "100%", height: pxToDp(10), backgroundColor: theme.baseBackgroundColor }}></View>

                        <View style={styles.orderinformation}>
                            {
                                Orderdtail?.product.map((item, index) => (
                                    <View key={`product_${index}`} style={{ paddingHorizontal: pxToDp(40) }}>
                                        <Touchable style={styles.orderinformationcon} onPress={() => this.Commodity(item)}>
                                            <View style={styles.orderinformationconcontent}>
                                                <Image style={styles.orderinformationconimage} source={{ uri: item.product_thumb }}></Image>
                                                <View style={styles.orderinformationconcontentinf}>
                                                    <View>
                                                        <Text style={styles.ordercommodityname} numberOfLines={1}>{item.product_name}</Text>
                                                    </View>
                                                    <View>
                                                        {
                                                            item.product_spec.map((itam, index) => (
                                                                <Text style={styles.ordercommodityintroduce} key={`product_spec_${index}`}>{itam.value}</Text>
                                                            ))
                                                        }
                                                    </View>
                                                    <View>
                                                        <Text style={styles.ordercommodityprice}>{numeral(item.product_price).format('$0,0.00')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.ordercommoditynumber}>X{item.product_num}</Text>
                                            </View>
                                        </Touchable>
                                        {
                                            item.return_money == 0 || item.return_money == null && item.is_return == 1 ?
                                                null
                                                :
                                                <View style={styles.refund}>
                                                    <Image style={styles.refundImage} source={require('../images/tuikuan.png')}></Image>
                                                    <Text style={styles.refundstate}>退款中:{numeral(item.return_money).format(moneyFormat)}元</Text>
                                                </View>
                                        }
                                        {item.status == -1 ?
                                            <View style={styles.refund}>
                                                {
                                                    item.return_money == 0 ?
                                                        <Text style={styles.refundstate}>已退款</Text>
                                                        :
                                                        <View>
                                                            <Image style={styles.refundImage} source={require('../images/tuikuan.png')}></Image>
                                                            <Text style={styles.refundstate}>已退款:{numeral(item.return_money).format(moneyFormat)}元</Text>
                                                        </View>
                                                }
                                            </View>
                                            : null
                                        }
                                        {this.Applysale(item)}
                                        <View style={{ width: "100%", height: pxToDp(2), backgroundColor: theme.baseBackgroundColor, marginTop: pxToDp(12) }}></View>
                                    </View>
                                ))
                            }
                            <View style={{ paddingHorizontal: pxToDp(40) }}>
                                {
                                    this.state.Orderdtail?.cancel_status == 1 && this.state.Orderdtail.status != -1 ?
                                        <View style={styles.single_com}>
                                            <Image style={styles.refundImage} source={require('../images/tuikuan.png')}></Image>
                                            <Text style={styles.refundstate}>退款中:{numeral(this.state.Orderdtail?.return_money).format(moneyFormat)}元</Text>
                                        </View>
                                        : null
                                }
                                {
                                    this.state.Orderdtail?.cancel_status == 2 ?
                                        <View style={styles.single_com}>
                                            <Image style={styles.refundImage} source={require('../images/tuikuan.png')}></Image>
                                            <Text style={styles.refundstate}>已退款:{numeral(this.state.Orderdtail?.return_money).format(moneyFormat)}元</Text>
                                        </View>
                                        : null
                                }
                                {this.Ordersituation(this.state.Orderdtail?.status, this.state.Orderdtail)}
                            </View>
                            <View style={{ width: "100%", height: pxToDp(10), backgroundColor: theme.baseBackgroundColor, marginTop: pxToDp(30) }}></View>
                        </View>

                        <View style={styles.typeinformation}>
                            <View style={styles.informationcon}>
                                <Text style={styles.typetitle}>商品合计</Text>
                                <Text style={styles.typecontent}>{Orderdtail?.total_money}元</Text>
                            </View>
                            <View style={styles.informationcon}>
                                <Text style={styles.typetitle}>优惠券</Text>
                                <Text style={styles.typecontent}>{Orderdtail?.coupon_money}元</Text>
                            </View>
                            <View style={styles.informationcon}>
                                <Text style={styles.typetitle}>运费</Text>
                                <Text style={styles.typecontent}>{Orderdtail?.deliver_money}元</Text>
                            </View>
                            <View style={styles.informationcon}>
                                <Text style={styles.typetitle}>实付</Text>
                                <Text style={styles.typecontent}>{Orderdtail?.real_total_money}元</Text>
                            </View>
                            <View style={styles.informationcon}>
                                <Text style={styles.typetitle}>订单编号</Text>
                                <Text style={styles.typecontent}>{Orderdtail?.order_no}</Text>
                            </View>
                            <View style={styles.informationcon}>
                                <Text style={styles.typetitle}>创建时间</Text>
                                <Text style={styles.typecontent}>{Orderdtail?.created_at}</Text>
                            </View>
                            <View style={styles.remarks}>
                                <Text style={styles.typetitle}>备注:</Text>
                                <Text style={styles.remarkscontent}>{Orderdtail?.content}</Text>
                            </View>
                        </View>
                        <View style={styles.Service_information}>
                            <Text style={styles.Service_time}>服务时间：早上8:00-晚上10:00周一至周日</Text>
                            <View style={styles.customer_service}>
                                <Touchable style={styles.online_customer} onPress={this.Customer}>
                                    <View style={styles.online_customercon}>
                                        <Image style={styles.online_customerconpin} source={require('../images/Online_contact.png')}></Image>
                                        <Text style={styles.online_customerconname}>在线客服</Text>
                                    </View>
                                </Touchable>
                                <Touchable style={styles.online_customer} onPress={this.Tel}>
                                    <View style={styles.online_customercon}>
                                        <Image style={styles.online_customerconpin} source={require('../images/Telephone_contact.png')}></Image>
                                        <Text style={styles.online_customerconname}>电话客服</Text>
                                    </View>
                                </Touchable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.again}>
                    {
                        Orderdtail?.status == 0 ?
                            <Text style={styles.buy_again_liji} onPress={() => this.Immediate(this.state.Orderdtail)}>立即付款</Text>
                            :
                            <Text style={styles.buy_again} onPress={() => this.Buyagain(this.state.Orderdtail)}>再次购买</Text>
                    }
                </View>
                {
                    this.state.tabIndex == 1 ?
                        <View style={styles.customer}>
                            <View style={styles.customer_con}>
                                <View style={styles.arrow}>
                                    <Touchable onPress={this.Colsecustomer}>
                                        <Image style={styles.jumptuichu} source={require('../images/icin_delete.png')}></Image>
                                    </Touchable>
                                </View>
                                <Touchable onPress={() => this.saveConfirm()}>
                                    <Image style={styles.customer_conImage} source={{ uri: apiDomain + 'weixin/assets/imgs/kefu.png' }}></Image>
                                </Touchable>
                                <Text style={styles.customer_content}> 您好，如需咨询，请长按识别上方二维码。如识别失败请搜索微信号：13914259886。</Text>
                            </View>
                        </View>
                        : null
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    myorder: {
        height: pxToDp(80),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "row",
        paddingHorizontal: pxToDp(40)

    },
    ordernumber: {
        fontSize: pxToDp(30),
        color: '#2D2D2D',
    },
    orderstate: {
        fontSize: pxToDp(30),
        color: '#66BFB8'
    },
    orderaddress: {
        height: pxToDp(150),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pxToDp(40)
    },
    addresspic: {
        width: pxToDp(36),
        height: pxToDp(40),
    },
    addressimage: {
        width: "100%",
        height: "100%"
    },
    orderaddressinformation: {
        marginLeft: pxToDp(40),
        justifyContent: 'space-between',
        display: 'flex',
    },
    myinformation: {
        flexDirection: 'row',
        flexWrap: "wrap"
    },
    myaddress: {
        width: pxToDp(600),
        display: 'flex',
        flexWrap: "nowrap",
    },
    addressname: {
        fontSize: pxToDp(30),
        color: '#2D2D2D'
    },
    ddressphoto: {
        fontSize: pxToDp(30),
        color: '#A3A8B0',
        marginLeft: pxToDp(30)
    },
    addressinformation: {
        fontSize: pxToDp(24),
        color: "#A3A8B0"
    },
    orderinformation: {
        marginTop: pxToDp(10),
        marginBottom: pxToDp(30),
    },
    orderinformationcon: {
        marginTop: pxToDp(30),
        height: pxToDp(120),
        justifyContent: 'space-between',
        flexDirection: 'row',
        display: 'flex'
    },
    orderinformationconcontent: {
        flexDirection: "row",
        height: pxToDp(120)
    },
    orderinformationconimage: {
        width: pxToDp(120),
        height: pxToDp(120),
        borderRadius: pxToDp(4),
    },
    orderinformationconcontentinf: {
        width: pxToDp(420),
        height: pxToDp(120),
        marginLeft: pxToDp(28),
        justifyContent: 'space-between',
        display: 'flex'
    },
    ordercommodityname: {
        fontSize: pxToDp(30),
        color: '#2D2D2D'
    },
    ordercommodityintroduce: {
        color: '#A3A8B0',
        fontSize: pxToDp(24)
    },
    ordercommodityprice: {
        fontSize: pxToDp(24),
        color: '#2D2D2D'
    },
    ordercommoditynumber: {
        fontSize: pxToDp(24),
        color: "#2D2D2D",
        lineHeight: pxToDp(120)
    },
    refund: {
        marginTop: pxToDp(20),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    single_com: {
        marginTop: pxToDp(30),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    refundstate: {
        fontSize: pxToDp(30),
        marginLeft: pxToDp(20)
    },
    refundImage: {
        width: pxToDp(30),
        height: pxToDp(30),
    },
    orderoperation: {
        height: pxToDp(60),
        display: 'flex',
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    orderoperationno: {
        marginTop: pxToDp(40),
        height: pxToDp(60),
        display: 'flex',
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    orderoperationsituation: {
        width: pxToDp(160),
        height: pxToDp(60),
        borderRadius: pxToDp(4),
        borderWidth: pxToDp(2),
        borderColor: "#444C59",
        borderStyle: "solid",
        textAlign: 'center',
        fontSize: pxToDp(30),
        color: '#444C59',
        lineHeight: pxToDp(60)
    },
    orderoperationsituationor: {
        width: pxToDp(160),
        height: pxToDp(60),
        borderRadius: pxToDp(4),
        borderWidth: pxToDp(2),
        borderColor: "#66BFB8",
        borderStyle: "solid",
        textAlign: 'center',
        fontSize: pxToDp(30),
        color: '#66BFB8',
        lineHeight: pxToDp(60)
    },
    orderoperationsituationorjin: {
        width: pxToDp(160),
        height: pxToDp(60),
        borderRadius: pxToDp(4),
        borderWidth: pxToDp(2),
        borderColor: "#A3A8B0",
        borderStyle: "solid",
        textAlign: 'center',
        fontSize: pxToDp(30),
        color: '#A3A8B0',
        lineHeight: pxToDp(60)
    },
    morecon: {
        fontSize: pxToDp(22),
        color: '#444C5A',
        lineHeight: pxToDp(60)
    },
    // 发票
    invoice: {
        height: pxToDp(90),
        display: "flex",
        justifyContent: 'space-between',
        flexDirection: "row",
        alignItems: 'center',
    },
    invoicetitle: {
        fontSize: pxToDp(30),
        color: "#2D2D2D"
    },
    Billing_situation: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    evidence: {
        color: "#A3A8B0",
        fontSize: pxToDp(30)
    },
    evidencejump: {
        width: pxToDp(16),
        height: pxToDp(28),
        marginLeft: pxToDp(10),
    },
    typeinformation: {
        marginTop: pxToDp(30),
        paddingHorizontal: pxToDp(40)
    },
    informationcon: {
        paddingVertical: pxToDp(10),
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    typetitle: {
        fontSize: pxToDp(30),
        color: '#2D2D2D'
    },
    typecontent: {
        fontSize: pxToDp(30),
        color: '#2D2D2D'
    },
    remarks: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    remarkscontent: {
        width: pxToDp(590),
        flexWrap: 'wrap',
        fontSize: pxToDp(30)
    },
    Service_information: {
        marginTop: pxToDp(20),
        paddingHorizontal: pxToDp(40)
    },
    Service_time: {
        paddingVertical: pxToDp(20),
        fontSize: pxToDp(24),
        color: '#A3A8B0'
    },
    customer_service: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: "row"
    },
    online_customer: {
        width: pxToDp(320),
        height: pxToDp(76),
        backgroundColor: "#F2F2F2",
        marginBottom: pxToDp(140),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    online_customercon: {
        flexDirection: "row",
        alignItems: 'center',
    },
    online_customerconpin: {
        width: pxToDp(40),
        height: pxToDp(40),
    },
    online_customerconname: {
        fontSize: pxToDp(30),
        color: '#2D2D2D',
        marginLeft: pxToDp(15)
    },
    again: {
        width: "100%",
        height: pxToDp(98),
    },
    buy_again: {
        width: "100%",
        height: pxToDp(98),
        backgroundColor: "#66BFB8",
        lineHeight: pxToDp(98),
        textAlign: "center",
        color: "white"
    },
    buy_again_liji: {
        width: "100%",
        height: pxToDp(98),
        backgroundColor: "#ff826e",
        lineHeight: pxToDp(98),
        textAlign: "center",
        color: "white"
    },
    customer: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    customer_con: {
        backgroundColor: "#dedede",
        borderRadius: pxToDp(16),
        paddingVertical: pxToDp(30),
        paddingHorizontal: pxToDp(30)
    },
    customer_conImage: {
        width: pxToDp(300),
        height: pxToDp(300)
    },
    arrow: {
        height: pxToDp(35),
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    jumptuichu: {
        width: pxToDp(25),
        height: pxToDp(25)
    },
    customer_content: {
        width: pxToDp(300),
        fontSize: pxToDp(26),
        marginTop: pxToDp(30)
    }

})

export default connect(({ Mine }) => ({ ...Mine }))(Orderdetails)
