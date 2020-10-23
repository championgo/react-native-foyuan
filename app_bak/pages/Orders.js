import React from 'react';
import { SafeAreaView, ScrollView, FlatList, View, Image, Text, StyleSheet, Alert, DeviceEventEmitter } from 'react-native';
import { Tabs, Tab } from 'native-base';
import Toast from 'react-native-tiny-toast';
import { connect } from 'react-redux';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import * as wechat from 'react-native-wechat-lib';

import { Button, Loading, Touchable, CountdownPay } from '../components';
import { theme, pxToDp, NavigationActions } from '../utils';
import Config from '../config';

const moneyFormat = '0,0.00';

class Orders extends React.Component {
    static navigationOptions = {
        title: '我的订单',
    };

    state = {
        tabList: [
            { name: '全部', val: 0, isMore: true, loadingMore: false, page: 1 },
            { name: '待付款', val: 1, isMore: true, loadingMore: false, page: 1 },
            { name: '待发货', val: 2, isMore: true, loadingMore: false, page: 1 },
            { name: '待收货', val: 3, isMore: true, loadingMore: false, page: 1 },
            { name: '待评价', val: 4, isMore: true, loadingMore: false, page: 1 },
        ],
        pageSize: 10,
        status: 0,
        index: 0,
        list: [],
        loading: false,
    };

    componentDidMount() {
        const { index, tabList } = this.state;
        this.setState({
            status: tabList[index].val
        }, () => {
            this.initServe();
        });
        // 广播事件 订单再次购买刷新数据
        this.EMIT = DeviceEventEmitter.addListener('Cancelorder', res => {
            if (res) {
                this.setState({
                    list: []
                }, () => {
                    this.initServe();
                });
            }
        });
    }
    componentWillUnmount() {
        // 卸载接受广播
        this.EMIT.remove();
    }

    /**
     * 初始化请求
     * @param {*} loading 请求状态
     * @param {*} loadingMore 下拉加载
     */
    initServe = (loading = true, loadingMore = false) => {
        const { dispatch } = this.props;
        const { status, pageSize, list, index, tabList } = this.state;

        if (loadingMore) {
            tabList[index].loadingMore = true;
        } else {
            if (list[index]) {
                return;
            }
        }

        this.setState({
            loading,
            tabList
        }, () => {
            dispatch({
                type: "Mine/orderList",
                payload: {
                    page: tabList[index].page,
                    pageSize,
                    status
                },
                callback: res => {
                    if (loadingMore) {
                        list[index] = [...list[index], ...res];
                    } else {
                        list[index] = res;
                    };

                    if (res.length >= pageSize) {
                        tabList[index].page += 1;
                    } else {
                        tabList[index].isMore = false;
                    };

                    tabList[index].loadingMore = false;

                    this.setState({
                        list,
                        tabList,
                        loading: false
                    });
                }
            });
        });
    }

    // 跳转订单详情
    OrderDetails = (item) => {
        item.refresh = () => {
            this.setState({
                list: []
            }, () => {
                this.initServe();
            });
        }
        this.props.dispatch(NavigationActions.navigate({ routeName: 'Orderdetails', params: item }))
    }

    /**
     * 列表函数
     * @param {*} item 列表项
     */
    _renderItem = ({ item }) => {
        return (
            <Touchable style={styles.orderItem} onPress={() => this.OrderDetails(item)}>
                <View style={styles.orderItemTitle}>
                    <Text style={styles.orderShoppingName} numberOfLines={1}>店铺：{item.shop.title}</Text>
                    {this.orderStatus(item.status)}
                </View>
                {
                    item.product.length > 1 ?
                        <ScrollView horizontal style={styles.orderProductsTwo}>
                            {
                                item.product.map((imgItem, imgIndex) => <Image
                                    key={'image' + imgIndex}
                                    style={[styles.orderProductsImg, imgIndex == item.product.length - 1 ? { marginRight: 0 } : '']}
                                    resizeMode="cover"
                                    source={{ uri: imgItem.product_thumb }}
                                />)
                            }
                        </ScrollView> :
                        <View style={styles.orderProductsOne}>
                            <Image
                                style={styles.orderProductsImg}
                                resizeMode="cover"
                                source={{ uri: item?.product[0]?.product_thumb }}
                            />
                            <View style={styles.orderProductsName}>
                                <Text style={styles.orderProductsNameText} numberOfLines={2}>{item?.product[0]?.product_name}</Text>
                            </View>
                        </View>
                }
                <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal} numberOfLines={1}>合计：{numeral(item?.real_total_money).format(moneyFormat)}元</Text>
                    {this.orderBtns(item.status, item)}
                </View>
                {
                    item.return_status == 1 ?
                        <View style={styles.orderTip}>
                            <Image
                                style={styles.orderTipImg}
                                resizeMode="contain"
                                source={require('../images/tuikuan.png')}
                            />
                            <Text style={styles.orderTipText}>退款中：{numeral(item.return_money).format(moneyFormat)}元</Text>
                        </View> :
                        null
                }
                {
                    item.return_status == 2 ?
                        <View style={styles.orderTip}>
                            <Image
                                style={styles.orderTipImg}
                                resizeMode="contain"
                                source={require('../images/tuikuan.png')}
                            />
                            <Text style={styles.orderTipText}>已退款：{numeral(item.return_money).format(moneyFormat)}元</Text>
                        </View> :
                        null
                }
            </Touchable>
        );
    }

    /**
     * 订单状态组件
     * @param {*} status 订单状态
     */
    orderStatus = status => {
        switch (status) {
            case 0:
                return <Text style={[styles.orderStatus]}>待付款</Text>;
            case 1:
                return <Text style={[styles.orderStatus]}>待发货</Text>;
            case 2:
                return <Text style={[styles.orderStatus]}>待收货</Text>;
            case 3:
                return <Text style={[styles.orderStatus]}>待评价</Text>;
            case 4:
                return <Text style={[styles.orderStatus]}>已评价</Text>;
            case 5:
                return <Text style={[styles.orderStatus]}>已结算</Text>;
            default:
                return <Text style={[styles.orderStatus]}>已取消</Text>;
        }
    }

    /**
     * 订单按钮组件
     * @param {*} status 订单状态
     */
    orderBtns = (status, item) => {
        switch (status) {
            case 0:
                return <View style={styles.Btns}>
                    <CountdownPay
                        end={item.left_time}
                        onFinish={res => this.onFinish(res, item)}
                        style={{
                            marginRight: pxToDp(50)
                        }}
                        textTimeStyle={{
                            color: theme.baseColor,
                            fontSize: pxToDp(28)
                        }}
                    />
                    <Button
                        text="付款"
                        style={[styles.orderBtn]}
                        loadingColor={theme.baseColor}
                        textStyle={[styles.orderBtnText]}
                        onPress={() => this.pay(item)}
                    />
                </View>;
            case 1:
                return <View style={styles.Btns}>
                    <Button
                        text="提醒发货"
                        style={[styles.orderBtn]}
                        loadingColor={theme.baseColor}
                        textStyle={[styles.orderBtnText]}
                        onPress={() => this.remindTheDelivery(item)}
                    />
                </View>;
            case 2:
                return <View style={styles.Btns}>
                    <Button
                        text="确认收货"
                        style={[styles.orderBtn]}
                        loadingColor={theme.baseColor}
                        textStyle={[styles.orderBtnText]}
                        onPress={() => this.confirmReceipt(item)}
                    />
                </View>;
            case 3:
                return <View style={styles.Btns}>
                    <Button
                        text="再次购买"
                        style={[styles.orderBtn, styles.orderBtnTwo]}
                        loadingColor={theme.baseColor}
                        textStyle={[styles.orderBtnText, styles.orderBtnTextTwo]}
                        onPress={() => this.buyAgain(item)}
                    />
                    <Button
                        text="评价"
                        style={[styles.orderBtn]}
                        loadingColor={theme.baseColor}
                        textStyle={[styles.orderBtnText]}
                        onPress={() => this.evaluate(item)}
                    />
                </View>;
            default:
                return <View style={styles.Btns}>
                    <Button
                        text="再次购买"
                        style={[styles.orderBtn]}
                        loadingColor={theme.baseColor}
                        textStyle={[styles.orderBtnText]}
                        onPress={() => this.buyAgain(item)}
                    />
                </View>;
        }
    }

    /**
     * 行与行之间的分隔线组件
     */
    _ItemSeparatorComponent = () => {
        return (
            <View style={styles.separator}></View>
        );
    }

    /**
    * 下拉加载
    * @param {*} info 
    */
    _onEndReached = (info) => {
        const { distanceFromEnd } = info;
        const { tabList, index } = this.state;
        if (distanceFromEnd < 0 || !tabList[index].isMore || tabList[index].loadingMore) {
            return;
        };
        this.initServe(false, true);
    }

    /**
     * 空状态组件
     */
    _ListEmptyComponent = () => {
        const { list, index } = this.state;
        return (
            !!list[index] ?
                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: pxToDp(100)
                }}>
                    <Image
                        style={{
                            width: pxToDp(340),
                            height: pxToDp(144),
                            marginBottom: pxToDp(10)
                        }}
                        resizeMode="contain"
                        source={require('../images/illustration_search.png')}
                    />
                    <Text style={{
                        fontSize: pxToDp(24),
                        color: '#a3a8b0'
                    }}>您还没有订单哦</Text>
                </View> :
                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: pxToDp(100)
                }}>
                    <Loading />
                </View>
        );
    }

    /**
     * 底部组件
     */
    _ListFooterComponent = () => {
        const { tabList, index, list } = this.state;
        if (!list[index] || list[index].length <= 0) {
            return null;
        };

        return (
            tabList[index].isMore ?
                <Button
                    style={styles.moreBtn}
                    textStyle={styles.moreBtnText}
                    loadingColor={theme.color666}
                    loading={tabList[index].loadingMore}
                    text={tabList[index].loadingMore ? '加载中' : "加载更多"}
                /> :
                <View style={styles.noMore}>
                    <Text style={styles.noMoreText}>—&nbsp;没有更多了&nbsp;—</Text>
                </View>
        );
    }

    /**
     * tab切换事件
     * @param {*} tab 选择的tab
     */
    onChangeTab = tab => {
        const { tabList } = this.state;
        this.setState({
            index: tab.i,
            status: tabList[tab.i].val
        }, () => {
            this.initServe(false);
        });
    }

    /**
     * 提醒发货
     * @param {*} item 选择项
     */
    remindTheDelivery = item => {
        const { dispatch } = this.props;

        if (item.remind != 1) {
            Toast.show('您已提醒，请勿多次提交哦', {
                position: 0,
                duration: 3000
            });
            return;
        };

        dispatch({
            type: "Mine/orderRemind",
            payload: {
                id: item.id
            },
            callback: res => {
                if (res) {
                    Alert.alert('', '提醒成功',
                        [
                            { text: "知道了", onPress: this.remindTheDeliveryOk },
                        ]
                    );
                }
            }
        });
    }

    /**
     * 知道了
     */
    remindTheDeliveryOk = () => {
        console.log('提醒确认成功');
    }

    /**
     * 再次购买
     * @param {*} item 选择项
     */
    buyAgain = item => {
        const { dispatch } = this.props;
        dispatch({
            type: "Mine/orderBuyAgain",
            payload: {
                id: item.id
            },
            callback: res => {
                if (res) {
                    DeviceEventEmitter.emit('buyAgain', true);
                    dispatch(NavigationActions.navigate({ routeName: 'ShoppingCart' }));
                }
            }
        });
    }

    /**
     * 确认收货
     * @param {*} item 选择项
     */
    confirmReceipt = item => {
        const { dispatch } = this.props;

        Alert.alert('', '您确定已收到商品？',
            [
                { text: "否" },
                {
                    text: "是", onPress: () => {
                        dispatch({
                            type: "Mine/orderConfirm",
                            payload: {
                                id: item.id
                            },
                            callback: res => {
                                if (res) {
                                    this.setState({
                                        tabList: [
                                            { name: '全部', val: 0, isMore: true, loadingMore: false, page: 1 },
                                            { name: '待付款', val: 1, isMore: true, loadingMore: false, page: 1 },
                                            { name: '待发货', val: 2, isMore: true, loadingMore: false, page: 1 },
                                            { name: '待收货', val: 3, isMore: true, loadingMore: false, page: 1 },
                                            { name: '待评价', val: 4, isMore: true, loadingMore: false, page: 1 },
                                        ],
                                        list: []
                                    }, () => {
                                        this.initServe(false);
                                    });
                                }
                            }
                        });
                    }
                },
            ]
        );
    }

    /**
     * 评价
     * @param {*} item 选择项
     */
    evaluate = item => {
        const { dispatch } = this.props;
        // item的id，在接受页直接在params中取值就可以
        dispatch(NavigationActions.navigate({ routeName: "Evaluate", params: item }));
    }

    /**
     * 付款倒计时完成后自动取消订单
     * @param {*} res 回调值
     * @param {*} item 选择项
     */
    onFinish = (res, item) => {
        if (res == 'finish') {
            const { dispatch } = this.props;
            dispatch({
                type: "Mine/orderCancle",
                payload: {
                    id: item.id
                },
                callback: res => {
                    if (res) {
                        this.setState({
                            tabList: [
                                { name: '全部', val: 0, isMore: true, loadingMore: false, page: 1 },
                                { name: '待付款', val: 1, isMore: true, loadingMore: false, page: 1 },
                                { name: '待发货', val: 2, isMore: true, loadingMore: false, page: 1 },
                                { name: '待收货', val: 3, isMore: true, loadingMore: false, page: 1 },
                                { name: '待评价', val: 4, isMore: true, loadingMore: false, page: 1 },
                            ],
                            list: []
                        }, () => {
                            this.initServe(false);
                        });
                    }
                }
            });
        }
    }

    /**
     * 付款
     * @param {*} item 选择项
     */
    pay = item => {
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
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "PaySuccessed" }));
    }

    render() {
        const { tabList, list, loading, index } = this.state;

        if (loading) {
            return <Loading />
        }

        return (
            <SafeAreaView style={styles.container}>
                <Tabs
                    locked
                    scrollWithoutAnimation
                    page={index}
                    onChangeTab={tab => this.onChangeTab(tab)}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                >
                    {tabList.map((tabTtem, tabIndex) => <Tab
                        heading={tabTtem.name} key={'tabs' + tabIndex}
                        tabStyle={styles.tabStyle}
                        activeTabStyle={styles.activeTabStyle}
                        textStyle={styles.textStyle}
                        activeTextStyle={styles.activeTextStyle}
                    >
                        <FlatList
                            legacyImplementation
                            removeClippedSubviews
                            initialNumToRender={3}
                            data={list[index]}
                            renderItem={this._renderItem}
                            keyExtractor={(listItem, index) => `listItem${listItem.id}_${index}`}
                            ListHeaderComponent={this._ItemSeparatorComponent}
                            ItemSeparatorComponent={this._ItemSeparatorComponent}
                            onEndReachedThreshold={0.1}
                            onEndReached={this._onEndReached}
                            ListEmptyComponent={this._ListEmptyComponent}
                            ListFooterComponent={this._ListFooterComponent}
                        />
                    </Tab>)}
                </Tabs>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    tabBarUnderlineStyle: {
        backgroundColor: theme.baseColor,
        height: pxToDp(3)
    },
    tabStyle: {
        backgroundColor: theme.colorWhite
    },
    activeTabStyle: {
        backgroundColor: theme.colorWhite
    },
    textStyle: {
        fontSize: pxToDp(30),
        color: "#444c59"
    },
    activeTextStyle: {
        fontSize: pxToDp(36),
        color: "#2d2d2d"
    },
    separator: {
        height: pxToDp(10),
        backgroundColor: theme.baseBackgroundColor
    },
    orderItem: {
        padding: pxToDp(40),
        backgroundColor: theme.colorWhite
    },
    orderItemTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    orderShoppingName: {
        flex: 1,
        fontSize: pxToDp(30),
        color: '#2d2d2d',
        paddingRight: pxToDp(20)
    },
    orderStatus: {
        fontSize: pxToDp(30),
        color: theme.baseColor
    },
    orderStatusColor: {},
    orderProductsOne: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: pxToDp(40),
        marginBottom: pxToDp(50)
    },
    orderProductsImg: {
        width: pxToDp(120),
        height: pxToDp(120),
        marginRight: pxToDp(30)
    },
    orderProductsName: {
        flex: 1,
    },
    orderProductsNameText: {
        fontSize: pxToDp(30),
        color: '#2d2d2d'
    },
    orderProductsTwo: {
        flexDirection: "row",
        overflow: "hidden",
        marginTop: pxToDp(40),
        marginBottom: pxToDp(50)
    },
    orderFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    orderTotal: {
        flex: 1,
        fontSize: pxToDp(30),
        color: '#2d2d2d'
    },
    Btns: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    orderBtn: {
        width: pxToDp(160),
        height: pxToDp(60),
        backgroundColor: theme.colorWhite,
        borderRadius: 0,
        borderWidth: pxToDp(2),
        borderColor: theme.baseColor,
        borderRadius: pxToDp(4)
    },
    orderBtnTwo: {
        color: "#444C5A",
        borderColor: "#444C5A",
        marginRight: pxToDp(30)
    },
    orderBtnText: {
        fontSize: pxToDp(28),
        color: theme.baseColor
    },
    orderBtnTextTwo: {
        color: "#444C5A",
    },
    orderTip: {
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    orderTipImg: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginRight: pxToDp(10)
    },
    orderTipText: {
        fontSize: pxToDp(28),
        color: theme.baseColor
    },
    noMore: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: pxToDp(20)
    },
    noMoreText: {
        color: theme.color666,
        fontSize: pxToDp(28)
    },
    moreBtn: {
        borderRadius: 0,
        backgroundColor: theme.colorWhite
    },
    moreBtnText: {
        color: theme.color666
    },
});

export default connect(({ Mine: { ...Mine } }) => ({ Mine }))(Orders);
