import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { Loading, Touchable, DashLine, Countdown, Button } from '../components';
import { NavigationActions, pxToDp, theme, seckillStatus } from '../utils';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import moment from 'moment';


class SeckillList extends Component {
    static navigationOptions = {
        title: '限时秒杀',
    }

    state = {
        pageSize: 10,
        page: 1,
        list: [],
        listHeader: {},
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
                type: 'HomeModel/seckillList',
                payload: {
                    pageSize,
                    page
                },
                callback: res => {
                    const arg = {};
                    if (res.products.length >= pageSize) {
                        arg.isMore = true;
                        arg.page = page + 1;
                    } else {
                        arg.isMore = false;
                    };
                    this.setState({
                        list: res.products,
                        listHeader: res.seckill,
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
                type: 'HomeModel/seckillList',
                payload: {
                    pageSize,
                    page
                },
                callback: res => {
                    const arg = {};
                    if (res.products.length >= pageSize) {
                        arg.isMore = true;
                        arg.page = page + 1;
                    } else {
                        arg.isMore = false;
                    };
                    const newList = [...list, ...res.products];
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
     * 列表项
     * @param {*} item 商品
     * @param {*} index 商品索引
     */
    _renderItem = ({ item, index }) => {
        const { list } = this.state;
        return (
            <Touchable style={styles.seckillList} onPress={() => this.gotoSeckillDetails(item)}>
                <Image style={styles.seckillListThumb} resizeMode="cover" source={{ uri: item.thumb }} />
                <View style={styles.seckillListInfoContainer}>
                    <View style={styles.seckillListInfo}>
                        <Text style={styles.seckillListName}>{item.name}</Text>
                        <View style={styles.seckillListProgressContainer}>
                            <View style={styles.seckillListProgress}>
                                <View style={[styles.seckillListProgressBar, { width: `${item.progress}%` }]}></View>
                                <Text style={[
                                    styles.seckillListProgressBarText,
                                    item.progress > 87 ? { right: 0 } : { left: `${item.progress}%` },
                                    item.progress > 5 ? { marginLeft: pxToDp(-40) } : { marginLeft: pxToDp(-20) }
                                ]}
                                >{item.progress}%</Text>
                            </View>
                            <Text style={styles.seckillListOver}>仅剩{item.remain}件</Text>
                        </View>
                        <View style={styles.seckillListFooterContainer}>
                            <View style={styles.seckillListFooterPrice}>
                                <Text style={styles.seckillListFooterPriceOne}>{numeral(item.price).format('$0,0.00')}</Text>
                                <Text style={styles.seckillListFooterPriceTwo}>{numeral(item.price_old).format('$0,0.00')}</Text>
                            </View>
                            <Text style={styles.seckillListRush}>马上抢</Text>
                        </View>
                    </View>
                    {
                        index >= list.length - 1 ?
                            null :
                            <DashLine backgroundColor="#F1F2F3" color="#F1F2F3" lineWidth={pxToDp(2)} borderStyle="solid" />
                    }
                </View>
            </Touchable>
        );
    }

    /**
     * 下拉加载
     * @param {*} info 
     */
    _onEndReached = (info) => {
        const { distanceFromEnd } = info;
        const { isMore } = this.state;
        if (distanceFromEnd < 0 || !isMore) {
            return;
        };
        this.loadingMore();
    }

    /**
     * 头部
     */
    _listHeaderComponent = () => {
        const { listHeader } = this.state;
        return (
            <View style={styles.listHeader}>
                <Image style={styles.listHeaderImage} resizeMode="cover" source={require('../images/seckillBanner.png')} />
                <Text style={styles.listHeaderText}>
                    {this.seckillStatusCurrent(listHeader?.start, listHeader?.end)}
                </Text>
            </View>
        );
    }

    /**
     * 尾部
     */
    _listFooterComponent = () => {
        const { isMore, loadingMore } = this.state;
        return (
            isMore ?
                <Button
                    style={styles.moreBtn}
                    textStyle={styles.moreBtnText}
                    loadingColor={theme.color666}
                    loading={loadingMore}
                    text={loadingMore ? '加载中' : "加载更多"}
                /> :
                <View style={styles.noMore}>
                    <Text style={styles.noMoreText}>—&nbsp;没有更多了&nbsp;—</Text>
                </View>
        );
    }

    /**
     * 秒杀状态
     * @param {*} start 开始时间
     * @param {*} end 结束时间
     */
    seckillStatusCurrent = (start, end) => {
        const { countdownTip } = this.state;
        switch (seckillStatus(start, end)) {
            case 1:
                return <Text>活动开始时间：{moment(start).format('YYYY-MM-DD HH:mm:ss')}</Text>;
            case 2:
                return <Countdown
                    end={end}
                    tip={countdownTip}
                    onFinish={this.onFinish}
                    textTipStyle={styles.countdownText}
                    textTimeStyle={styles.countdownText}
                />;
            case 3:
                return <Text>活动已结束</Text>;
            default:
                return null;
        }
    }

    /**
     * 倒计时回调函数
     * @param {*} val 回调值
     */
    onFinish = (val) => {
        if (val === 'finish') {
            this.setState({
                countdownTip: '活动已结束'
            });
        }
    }

    /**
     * go to 秒杀商品详情
     * @param {*} item 秒杀商品
     */
    gotoSeckillDetails = (item) => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "SeckillDetails", params: item }));
    }

    render() {
        const { list, loading } = this.state;

        if (!!loading) {
            return <Loading />
        }

        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={list}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => 'seckillList' + item.id + index}
                    onEndReachedThreshold={0.1}
                    onEndReached={this._onEndReached}
                    ListHeaderComponent={this._listHeaderComponent}
                    ListFooterComponent={this._listFooterComponent}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colorWhite,
    },
    listHeader: {
        paddingHorizontal: pxToDp(40),
        paddingTop: pxToDp(20),
        flexDirection: "column",
        alignItems: "center"
    },
    listHeaderImage: {
        width: '100%',
        height: pxToDp(314)
    },
    listHeaderText: {
        fontSize: pxToDp(36),
        color: '#eb5959',
        fontWeight: '700',
        paddingVertical: pxToDp(40)
    },
    countdownText: {
        fontSize: pxToDp(36),
        color: '#eb5959',
        fontWeight: '700',
    },
    seckillTitleRText: {
        fontSize: pxToDp(24),
        fontWeight: '500',
        color: theme.color333
    },
    seckillList: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: pxToDp(40)
    },
    seckillListThumb: {
        width: pxToDp(180),
        height: pxToDp(180),
        borderRadius: pxToDp(8)
    },
    seckillListInfoContainer: {
        flex: 1,
        marginLeft: pxToDp(24),
    },
    seckillListInfo: {
        flex: 1,
        height: pxToDp(180),
        paddingVertical: pxToDp(8),
        marginVertical: pxToDp(12),
        flexDirection: "column",
        justifyContent: "space-between"
    },
    seckillListName: {
        fontSize: pxToDp(32),
        fontWeight: '500',
        color: theme.color333,
    },
    seckillListProgressContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    seckillListProgress: {
        position: "relative",
        width: "66%",
        height: pxToDp(24),
        borderRadius: pxToDp(12),
        borderWidth: pxToDp(2),
        borderColor: theme.baseColor
    },
    seckillListProgressBar: {
        height: "100%",
        backgroundColor: "rgba(102, 191, 184, 0.4)",
        borderRadius: pxToDp(10),
    },
    seckillListProgressBarText: {
        position: "absolute",
        top: 0,
        color: theme.baseColor,
        fontSize: pxToDp(20),
        fontWeight: "400",
        width: pxToDp(80),
        height: '100%',
        lineHeight: pxToDp(22),
        textAlign: "center",
    },
    seckillListOver: {
        flex: 1,
        fontSize: pxToDp(24),
        fontWeight: '400',
        color: theme.color999,
        textAlign: "right"
    },
    seckillListFooterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    seckillListFooterPrice: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
    },
    seckillListFooterPriceOne: {
        fontSize: pxToDp(36),
        fontWeight: "500",
        color: theme.baseColor,
        marginBottom: pxToDp(-8),
        marginRight: pxToDp(8)
    },
    seckillListFooterPriceTwo: {
        fontSize: pxToDp(14),
        fontWeight: "400",
        color: theme.color999,
        textDecorationLine: "line-through",
        textDecorationColor: theme.color999,
        alignSelf: "flex-end"
    },
    seckillListRush: {
        color: theme.colorWhite,
        fontWeight: "500",
        fontSize: pxToDp(24),
        backgroundColor: theme.baseColor,
        borderRadius: pxToDp(8),
        paddingVertical: pxToDp(16),
        paddingHorizontal: pxToDp(20)
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
})

export default connect(({ HomeModel: { ...HomeModel } }) => ({ HomeModel }))(SeckillList)
