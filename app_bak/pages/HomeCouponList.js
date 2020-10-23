import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, SafeAreaView, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { Button, Loading, Touchable } from '../components';
import { NavigationActions, pxToDp, theme } from '../utils';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import moment from 'moment';

class HomeCouponList extends Component {
    static navigationOptions = {
        title: '优惠券专区',
    }

    state = {
        pageSize: 10,
        page: 1,
        list: [],
        loading: false,
        loadingMore: false,
        isMore: true,
    }

    componentDidMount() {
        this.initService();
    }

    /**
     * 初始化请求-获取优惠券列表
     * @param {*} loading 
     */
    initService = (loading = true) => {
        const { dispatch } = this.props;
        const { pageSize, page } = this.state;
        this.setState({
            loading
        }, () => {
            dispatch({
                type: 'HomeModel/couponList',
                payload: {
                    pageSize,
                    page
                },
                callback: res => {
                    const arg = {};
                    if (res.length >= pageSize) {
                        arg.isMore = true;
                        arg.page = page + 1;
                    } else {
                        arg.isMore = false;
                    };
                    this.setState({
                        list: res,
                        loading: false,
                        ...arg
                    });
                }
            });
        });
    }

    /**
     * 加载更多
     */
    loadingMore = () => {
        const { dispatch } = this.props;
        const { list, pageSize, page, loadingMore } = this.state;

        if (!!loadingMore) {
            return;
        }

        this.setState({
            loadingMore: true
        }, () => {
            dispatch({
                type: 'HomeModel/couponList',
                payload: {
                    pageSize,
                    page
                },
                callback: res => {
                    const arg = {};
                    if (res.length >= pageSize) {
                        arg.isMore = true;
                        arg.page = page + 1;
                    } else {
                        arg.isMore = false;
                    };
                    const newList = [...list, ...res];
                    this.setState({
                        list: newList,
                        loadingMore: false,
                        ...arg
                    });
                }
            });
        });
    }

    /**
     * 获取优惠卷
     * @param {*} item 优惠卷
     */
    getCoupon = (item, index) => {
        const { couponList } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: "HomeModel/getCoupon",
            payload: {
                coupon_id: item.id
            },
            callback: res => {
                couponList[index].receive = 1;
                this.setState({
                    list: couponList
                });
            }
        });
    }

    render() {
        const { list, loading, isMore, loadingMore } = this.state;

        if (!!loading) {
            return <Loading />
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.couponList}>
                        {
                            list.map((item, index) => <View key={'coupon' + index} style={[styles.couponListItem, styles.marginBottom_40]}>
                                <ImageBackground
                                    style={styles.couponBackground}
                                    source={require('../images/coupon_2.png')}
                                    resizeMode="stretch"
                                >
                                    <View style={styles.couponBackgroundContainer}>
                                        <View style={styles.couponBackgroundContainerL}>
                                            <Text style={styles.couponBackgroundContainerLPrice}>{numeral(item.money).format('$0,0.00')}</Text>
                                            <Text style={styles.couponBackgroundContainerLRule}>满{numeral(item.spend_money).format('0,0.00')}元使用</Text>
                                        </View>
                                        <View style={styles.couponBackgroundContainerR}>
                                            <Text style={styles.couponBackgroundContainerLDeadline}>有效期至&nbsp;{moment(item.valid_end_at).format('YYYY-MM-DD')}</Text>
                                            <Text style={styles.couponBackgroundContainerLDeadline}>可用范围: {item.userange == 0 ? '全场通用' : '其他'}</Text>
                                            <Touchable style={styles.receiveBtn} onPress={() => this.getCoupon(item, index)}>
                                                <Text style={styles.receive}>{item.receive == 0 ? '领取' : '已领取'}</Text>
                                            </Touchable>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>)
                        }
                        {
                            isMore ?
                                <Button
                                    style={styles.moreBtn}
                                    loading={loadingMore}
                                    text={loadingMore ? '加载中' : "加载更多"}
                                    onPress={() => this.loadingMore()}
                                /> :
                                <View style={styles.noMore}>
                                    <Text style={styles.noMoreText}>—&nbsp;没有更多了&nbsp;—</Text>
                                </View>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    couponList: {
        padding: pxToDp(40)
    },
    couponListItem: {
        height: pxToDp(236),
    },
    marginBottom_40: {
        marginBottom: pxToDp(40)
    },
    couponBackground: {
        width: "100%",
        height: '100%',
    },
    couponBackgroundContainer: {
        padding: pxToDp(40),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    couponBackgroundContainerL: {
        flex: 1,
        alignItems: "center"
    },
    couponBackgroundContainerLPrice: {
        fontSize: pxToDp(80),
        color: theme.colorWhite
    },
    couponBackgroundContainerLRule: {
        fontSize: pxToDp(28),
        color: theme.colorWhite
    },
    couponBackgroundContainerLDeadline: {
        fontSize: pxToDp(28),
        color: theme.colorWhite,
        marginBottom: pxToDp(10)
    },
    couponBackgroundContainerR: {
        paddingHorizontal: pxToDp(20)
    },
    receiveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: pxToDp(2),
        borderColor: theme.colorWhite,
        width: '50%',
        height: pxToDp(62),
    },
    receive: {
        fontSize: pxToDp(28),
        color: theme.colorWhite
    },
    noMore: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    noMoreText: {
        color: theme.color666,
        fontSize: pxToDp(28)
    },
    moreBtn: {
        borderRadius: 0
    }
})

export default connect(({ HomeModel: { ...HomeModel } }) => ({ HomeModel }))(HomeCouponList)
