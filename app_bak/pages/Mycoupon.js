import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    SafeAreaView,
    Text,
    ImageBackground,
    FlatList,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from '../components';
import { NavigationActions, pxToDp, theme } from '../utils';
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import moment from 'moment';
import Toast from 'react-native-tiny-toast';
import { Tab, Tabs } from 'native-base';

class Mycoupon extends Component {
    static navigationOptions = {
        title: '我的优惠券',
    }
    constructor(props) {
        super(props);
        this.state = {
            // 头部导航切换
            Tab: [
                { name: "未使用", val: 1, isMore: true, loadingMore: false, page: 1 },
                { name: '已使用', val: 0, isMore: true, loadingMore: false, page: 1 },
                { name: '已过期', val: 2, isMore: true, loadingMore: false, page: 1 }
            ],
            index: 0,
            status: 0,
            pageSize: 10,
            // 过期优惠券
            beoverduecoupon: [],
            Cardnumber: "",
            opacity: 0,
            modalVisiblenumb: false,
            loading: false,

        };
    }
    componentDidMount() {
        const { index, Tab } = this.state;
        this.setState({
            status: Tab[index].val
        }, () => {
            this.initServe();
        });
    }
    /**
         * 初始化请求
         * @param {*} loading 请求状态
         * @param {*} loadingMore 下拉加载
         */
    initServe = (loading = true, loadingMore = false) => {
        const { dispatch } = this.props;
        const { status, pageSize, beoverduecoupon, index, Tab } = this.state;

        if (loadingMore) {
            Tab[index].loadingMore = true;
        } else {
            if (beoverduecoupon[index]) {
                return;
            }
        }

        this.setState({
            loading,
            Tab
        }, () => {
            dispatch({
                type: "commodityModel/couponslist",
                payload: {
                    page: Tab[index].page,
                    pageSize,
                    status
                },
                callback: res => {
                    if (loadingMore) {
                        beoverduecoupon[index] = [...beoverduecoupon[index], ...res];
                    } else {
                        beoverduecoupon[index] = res.data;
                    };

                    if (res.length >= pageSize) {
                        Tab[index].page += 1;
                    } else {
                        Tab[index].isMore = false;
                    };

                    Tab[index].loadingMore = false;

                    this.setState({
                        beoverduecoupon,
                        Tab,
                        loading: false
                    });
                }
            });
        });
    }

    // 上拉加载
    onEndReached = (info) => {
        const { distanceFromEnd } = info;
        const { Tab, index } = this.state;
        if (distanceFromEnd < 0 || !Tab[index].isMore) {
            return;
        };
        this.initServe(false, true);
    }
    // 去使用优惠券
    getCoupon = (item) => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'DiscountJump', params: item }))
    }

    // 优惠券tab切换
    Onchang = (tab) => {
        this.setState({
            index: tab.i,
            status: this.state.Tab[tab.i].val
        }, () => {
            this.initServe(false);
        });
    }

    Item(item) {
        if (this.state.index == 0) {
            return (
                <View style={styles.content}>
                    <View style={styles.couponListItem}>
                        <ImageBackground
                            style={styles.couponBackground}
                            source={item.coupon.platform == 1 ? require('../images/coupon.png') : require('../images/coupon_2.png')}
                            resizeMode="stretch"
                        >
                            <View style={styles.couponBackgroundContainer}>
                                <View style={styles.couponBackgroundContainerL}>
                                    <Text style={styles.couponBackgroundContainerLPrice}>{numeral(item.coupon.money).format('$0,0.00')}</Text>
                                    <Text style={styles.couponBackgroundContainerLRule}>满{numeral(item.coupon.spend_money).format('0,0.00')}元使用</Text>
                                </View>
                                <View style={styles.couponBackgroundContainerR}>
                                    <Text style={styles.couponBackgroundContainerLDeadline}>有效期至&nbsp;{moment(item.coupon.validtime).format('YYYY-MM-DD')}</Text>
                                    <Text style={styles.couponBackgroundContainerLDeadline}>可用范围: {item.coupon.shop.title}</Text>
                                    <Touchable style={styles.receiveBtn} onPress={() => this.getCoupon(item)}>
                                        <Text style={styles.receive}>去使用</Text>
                                    </Touchable>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            )
        } else
            if (this.state.index == 1) {
                return (
                    <View style={styles.content}>
                        <View style={styles.couponListItem}>
                            <ImageBackground
                                style={styles.couponBackground}
                                source={require('../images/be_overdue.png')}
                                resizeMode="stretch"
                            >
                                <View style={styles.couponBackgroundContainer}>
                                    <View style={styles.couponBackgroundContainerL}>
                                        <Text style={styles.couponBackgroundContainerLPrice}>{numeral(item.coupon.money).format('$0,0.00')}</Text>
                                        <Text style={styles.couponBackgroundContainerLRule}>满{numeral(item.coupon.spend_money).format('0,0.00')}元使用</Text>
                                    </View>
                                    <View style={styles.couponBackgroundContainerRY}>
                                        <Text style={styles.couponBackgroundContainerLDeadline}>有效期至&nbsp;{moment(item.coupon.validtime).format('YYYY-MM-DD')}</Text>
                                        <Text style={styles.couponBackgroundContainerLDeadline}>可用范围: {item.coupon.shop.title}</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                )
            } else
                if (this.state.index == 2) {
                    return (
                        <View style={styles.content}>
                            <View style={styles.couponListItem}>
                                <ImageBackground style={styles.couponBackground} source={require('../images/invalid.png')} resizeMode="stretch">
                                    <View style={styles.couponBackgroundContainer}>
                                        <View style={styles.couponBackgroundContainerL}>
                                            <Text style={styles.couponBackgroundContainerLPrice}>{numeral(item.coupon.money).format('$0,0.00')}</Text>
                                            <Text style={styles.couponBackgroundContainerLRule}>满{numeral(item.coupon.spend_money).format('0,0.00')}元使用</Text>
                                        </View>
                                        <View style={styles.couponBackgroundContainerRY}>
                                            <Text style={styles.couponBackgroundContainerLDeadline}>有效期至&nbsp;{moment(item.coupon.validtime).format('YYYY-MM-DD')}</Text>
                                            <Text style={styles.couponBackgroundContainerLDeadline}>可用范围: {item.coupon.shop.title}</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>
                    )
                }
    }
    Activation = () => {
        this.setState({
            modalVisiblenumb: true
        })
    }
    Emptycancel = () => {
        this.setState({
            modalVisiblenumb: false
        })
    }
    // 兑换优惠券
    Emptyconfirm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/receiveCoupon',
            payload: {
                code: this.state.Cardnumber,
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        Cardnumber: '',
                        modalVisiblenumb: false,
                        opacity: 0
                    }, () => {
                        this.initServe()
                        Toast.show(res.errmsg, {
                            position: 0,
                            duration: 2000,
                        });
                    })
                } else {
                    this.setState({
                        Cardnumber: '',
                        modalVisiblenumb: false,
                        opacity: 0
                    }, () => {
                        Toast.show(res.errmsg, {
                            position: 0,
                            duration: 2000,
                        });
                    })
                }
            }
        })
    }
    // TextInput框有值时
    updateText = (event) => {
        if (event.nativeEvent.text != '') {
            this.setState({
                opacity: 1
            })
        } else {
            this.setState({
                opacity: 0
            })
        }
    }
    // 上拉加载
    _ListEmptyComponent = () => {
        return (
            !!this.state.beoverduecoupon[this.state.index] ?
                <View style={styles.couponsnumber}>
                    <Image style={styles.nocouponsnumber} source={require('../images/illustration_coupon.png')}></Image>
                    <Text style={styles.nocouponsnumbertitle}>您没有的优惠券哦</Text>
                </View>
                :
                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: pxToDp(100)
                }}>
                    <Loading />
                </View>
        )
    }
    // 底部组件
    _ListFooterComponent = () => {
        const { Tab, index, beoverduecoupon } = this.state;
        if (!beoverduecoupon[index] || beoverduecoupon[index].length <= 0) {
            return null;
        };
        return (
            Tab[index].isMore ?
                <Button
                    style={styles.moreBtn}
                    textStyle={styles.moreBtnText}
                    loadingColor={theme.color666}
                    loading={Tab[index].loadingMore}
                    text={Tab[index].loadingMore ? '加载中' : "加载更多"}
                /> :
                <View style={styles.noMore}>
                    <Text style={styles.noMoreText}>—&nbsp;没有更多了&nbsp;—</Text>
                </View>
        );
    }
    render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <Tabs tabBarUnderlineStyle={{ backgroundColor: "#66BFB8" }} onChangeTab={(tab) => this.Onchang(tab)}>
                    {
                        this.state.Tab.map((item) => (
                            <Tab heading={item.name}
                                activeTabStyle={{ backgroundColor: "white" }}
                                tabStyle={{ backgroundColor: 'white' }}
                                activeTextStyle={{ color: 'black' }}
                                textStyle={{ color: "black" }}>
                                {
                                    this.state.index == 0 ?
                                        <View style={styles.exchange}>
                                            <View style={styles.exchangebod}>
                                                <TextInput style={styles.exchangebodinput}
                                                    placeholder="请输入卡号"
                                                    placeholderTextColor="rgb(195, 195, 195)"
                                                    value={this.state.Cardnumber}
                                                    onChangeText={(Cardnumber) => this.setState({ Cardnumber })}
                                                    onChange={(event) => this.updateText(event)}
                                                />
                                            </View>
                                            {
                                                this.state.opacity == 0 ?
                                                    <View style={styles.exchangebutton}>
                                                        <Text style={styles.exchangebuttontit}>兑换</Text>
                                                    </View>
                                                    :
                                                    <View style={styles.exchangebuttona}>
                                                        <Text style={styles.exchangebuttontit} onPress={this.Activation}>兑换</Text>
                                                    </View>
                                            }
                                        </View>
                                        : null
                                }
                                <FlatList
                                    data={this.state.beoverduecoupon[this.state.index]}
                                    renderItem={({ item }) => this.Item(item)}
                                    keyExtractor={Item => Item.id}
                                    onEndReached={this.onEndReached}
                                    ListFooterComponent={this._ListFooterComponent}
                                    onEndReachedThreshold={0.2}
                                    ListEmptyComponent={this._ListEmptyComponent}
                                />
                            </Tab>
                        ))
                    }
                </Tabs>

                {/* 激活弹框 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisiblenumb}
                    onRequestClose={() => this.setState({ modalVisiblenumb: false })}>
                    <TouchableWithoutFeedback onPress={() => this.setState({ modalVisiblenumb: false })}>
                        <View style={styles.commoditynumber}>
                            <View style={styles.empatycommodity}>
                                <View style={styles.empatycommoditytitle}>
                                    <Text style={styles.empatycommoditytitlecon}>您确定要激活该优惠券吗？</Text>
                                </View>
                                <View style={styles.empatycommoditybuuton}>
                                    <Text style={styles.emptycancel} onPress={this.Emptycancel}>否</Text>
                                    <Text style={styles.emptyconfirm} onPress={this.Emptyconfirm}>是</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
    },
    // 优惠券内容
    content: {
        paddingHorizontal: pxToDp(40),
        marginTop: pxToDp(30),
        marginBottom: pxToDp(20)
    },
    couponListItem: {
        height: pxToDp(236),
    },
    couponBackground: {
        width: "100%",
        height: '100%',
        justifyContent: 'center'
    },
    couponBackgroundContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    couponBackgroundContainerL: {
        width: pxToDp(320),
        alignItems: "center",
        justifyContent: 'center',
    },
    couponBackgroundContainerLPrice: {
        fontSize: pxToDp(60),
        color: theme.colorWhite
    },
    couponBackgroundContainerLRule: {
        fontSize: pxToDp(20),
        color: theme.colorWhite
    },
    couponBackgroundContainerLDeadline: {
        fontSize: pxToDp(24),
        color: theme.colorWhite,
        marginBottom: pxToDp(10)
    },
    couponBackgroundContainerR: {
        width: pxToDp(340),
        paddingHorizontal: pxToDp(20)
    },
    receiveBtn: {
        borderWidth: pxToDp(2),
        borderColor: theme.colorWhite,
        width: pxToDp(130),
        paddingVertical: pxToDp(4),
        borderRadius: pxToDp(2)
    },
    receive: {
        fontSize: pxToDp(28),
        textAlign: 'center',
        color: theme.colorWhite
    },
    couponBackgroundContainerRY: {
        width: pxToDp(340),
        marginTop: pxToDp(25),
        textAlign: "left"
    },
    couponsnumber: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: pxToDp(30)
    },
    nocouponsnumber: {
        width: pxToDp(340),
        height: pxToDp(140),
        marginTop: pxToDp(50)
    },
    nocouponsnumbertitle: {
        fontSize: pxToDp(24),
        color: "#a3a8b0",
        textAlign: 'center',
        marginTop: pxToDp(20)
    },
    // 兑换
    exchange: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: pxToDp(40),
        paddingTop: pxToDp(30),
        backgroundColor: "white"
    },
    exchangebod: {
        width: pxToDp(450),
        height: pxToDp(100),
        backgroundColor: "#f8f8f8",
        borderRadius: pxToDp(4),
        justifyContent: 'center'
    },
    exchangebutton: {
        width: pxToDp(200),
        height: pxToDp(100),
        backgroundColor: "#66bfb8",
        borderRadius: pxToDp(4),
        opacity: 0.6
    },
    exchangebuttona: {
        width: pxToDp(200),
        height: pxToDp(100),
        backgroundColor: "#66bfb8",
        borderRadius: pxToDp(4),
    },
    exchangebodinput: {
        width: "100%",
        height: pxToDp(76),
        fontSize: pxToDp(30),
    },
    exchangebuttontit: {
        fontSize: pxToDp(30),
        textAlign: 'center',
        lineHeight: pxToDp(100),
        color: 'white'
    },
    commoditynumber: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    empatycommodity: {
        width: pxToDp(440),
        backgroundColor: "white"
    },
    empatycommoditytitle: {
        width: "100%",
        height: pxToDp(180),
        borderColor: "#f2f2f2",
        borderBottomWidth: 1,
        borderStyle: "solid",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
    },
    empatycommoditytitlecon: {
        fontSize: pxToDp(30)
    },
    empatycommoditybuuton: {
        width: "100%",
        height: pxToDp(90),
        flexDirection: 'row'
    },
    emptycancel: {
        width: "50%",
        height: pxToDp(90),
        borderColor: "#f2f2f2",
        borderRightWidth: 1,
        borderStyle: "solid",
        lineHeight: pxToDp(90),
        textAlign: 'center',
        fontSize: pxToDp(30)
    },
    emptyconfirm: {
        width: "50%",
        height: pxToDp(90),
        lineHeight: pxToDp(90),
        textAlign: 'center',
        fontSize: pxToDp(30),
        color: "#66bfb8"
    },
    moreBtn: {
        borderRadius: 0,
        backgroundColor: theme.colorWhite
    },
    moreBtnText: {
        color: theme.color666
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
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(Mycoupon)
