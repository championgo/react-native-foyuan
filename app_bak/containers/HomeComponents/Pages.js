import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, SafeAreaView, RefreshControl, ImageBackground } from 'react-native';
import { Toast } from 'native-base';
import Swiper from 'react-native-swiper';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import moment from 'moment';

import { pxToDp, theme, NavigationActions, seckillStatus } from '../../utils'

import { DashLine, Loading, Touchable, Countdown } from '../../components';
import StyleOne from './StyleOne';
import StyleTwo from './StyleTwo';
import StyleThree from './StyleThree';
import StyleFour from './StyleFour';

class Pages extends React.Component {
    state = {
        countdownTip: '剩余时间'
    };

    /**
     * 视图组
     * @param {*} item 列表项
     */
    styleComponents = (item) => {
        const { goDetail } = this.props;

        switch (item.style) {
            case 1:
                return <StyleOne key={'StyleOne' + item.id} list={item.list || []} goDetail={item => goDetail(item)} />;
            case 2:
                return <StyleTwo key={'StyleTwo' + item.id} list={item.list || []} goDetail={item => goDetail(item)} />;
            case 3:
                return <StyleThree key={'StyleThree' + item.id} list={item.list || []} goDetail={item => goDetail(item)} />;
            default:
                return <StyleFour key={'StyleFour' + item.id} list={item.list || []} goDetail={item => goDetail(item)} />;
        }
    }

    /**
   * go to 首页优惠券专区
   */
    gotoHomeCouponList = () => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "HomeCouponList" }));
    }

    /**
     * go to 秒杀商品详情
     * @param {*} item 秒杀商品
     */
    gotoSeckillDetails = (item) => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "SeckillDetails", params: item }));
    }

    /**
     * go to 秒杀列表
     */
    gotoSeckillList = () => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: "SeckillList" }));
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
                return <Text style={styles.seckillTitleRText}>活动开始时间：{moment(start).format('YYYY-MM-DD HH:mm:ss')}</Text>;
            case 2:
                return <Countdown end={end} tip={countdownTip} onFinish={this.onFinish} />;
            case 3:
                return <Text style={styles.seckillTitleRText}>活动已结束</Text>;
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

    render() {
        const { navIndex, data, onBanner, seeMore, onRefresh, isRefreshing, couponList, getCoupon, seckillDatas, listStatus } = this.props;

        if (!!!data) {
            return <Loading />;
        }

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            // tintColor={theme.baseColor}
                            // title="Loading..."
                            // titleColor="#00ff00"
                            colors={[theme.baseColor]}
                        // progressBackgroundColor={theme.baseColor}
                        />
                    }
                >
                    {
                        data && data.images ? <Swiper
                            style={styles.wrapper}
                            loop
                            autoplay
                            autoplayTimeout={3}
                            dot={
                                <View
                                    style={{
                                        backgroundColor: theme.colorWhite,
                                        width: pxToDp(8),
                                        height: pxToDp(8),
                                        borderRadius: pxToDp(4),
                                        marginLeft: pxToDp(8),
                                        marginRight: pxToDp(8),
                                    }}
                                />
                            }
                            activeDot={
                                <View
                                    style={{
                                        backgroundColor: theme.baseColor,
                                        width: pxToDp(32),
                                        height: pxToDp(8),
                                        borderRadius: pxToDp(4),
                                        marginLeft: pxToDp(8),
                                        marginRight: pxToDp(8),
                                    }}
                                />
                            }
                            paginationStyle={{
                                bottom: pxToDp(10)
                            }}
                        >
                            {
                                data.images.map((item, index) => <Touchable key={'banner' + index} onPress={() => onBanner(item)}>
                                    <Image style={styles.banner} resizeMode="cover" source={{ uri: item.image }} />
                                </Touchable>)
                            }
                        </Swiper> : null
                    }
                    {
                        navIndex == 0 && (listStatus && listStatus[1].hide == 0) ? <View style={styles.coupons}>
                            <View style={styles.couponsTitle}>
                                <Text style={styles.couponsTitleText}>优惠券</Text>
                                <Touchable style={styles.couponsTitleMore} onPress={this.gotoHomeCouponList}>
                                    <Text style={[styles.couponsTitleMoreText, styles.marginRight_10]}>更多优惠</Text>
                                    <Text style={[styles.couponsTitleMoreText, styles.fontSize_30]}>&gt;</Text>
                                </Touchable>
                            </View>
                            <View style={styles.couponList}>
                                {
                                    couponList.map((item, index) => <View key={'coupon' + index} style={styles.couponListItem}>
                                        <ImageBackground
                                            style={styles.couponBackground}
                                            source={require('../../images/coupon.png')}
                                            resizeMode="stretch"
                                        >
                                            <View style={styles.couponBackgroundContainer}>
                                                <View style={styles.couponBackgroundContainerL}>
                                                    <Text style={styles.couponBackgroundContainerLPrice}>{numeral(item.money).format('$0,0')}</Text>
                                                    <Text style={styles.couponBackgroundContainerLRule}>满{numeral(item.spend_money).format('0,0.00')}元使用</Text>
                                                    <Text style={styles.couponBackgroundContainerLDeadline}>{moment(item.send_start_at).format('MM-DD')}&nbsp;—&nbsp;{moment(item.send_end_at).format('MM-DD')}</Text>
                                                </View>
                                                <Touchable style={styles.couponBackgroundContainerR} onPress={() => getCoupon(item, index)}>
                                                    <Text style={styles.receive}>{item.receive == 0 ? '领取' : '已领取'}</Text>
                                                </Touchable>
                                            </View>
                                        </ImageBackground>
                                    </View>)
                                }
                            </View>
                        </View> :
                            null
                    }
                    {
                        navIndex == 0 && (listStatus && listStatus[2].hide == 0) ?
                            <View style={styles.seckill}>
                                <View style={styles.seckillTitle}>
                                    <View style={styles.seckillTitleL}>
                                        <Image resizeMode="contain" style={styles.seckillTitleLImage} source={require('../../images/seckill.png')} />
                                        <Text style={styles.seckillTitleLText}>限时秒杀</Text>
                                    </View>
                                    <View style={styles.seckillTitleR}>
                                        {
                                            this.seckillStatusCurrent(seckillDatas?.seckill?.start, seckillDatas?.seckill?.end)
                                        }
                                    </View>
                                </View>
                                {
                                    seckillDatas && seckillDatas?.products?.map((item, index) => {
                                        return (
                                            <Touchable style={styles.seckillList} key={'seckillList' + index} onPress={() => this.gotoSeckillDetails(item)}>
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
                                                        index >= seckillDatas?.products?.length - 1 ?
                                                            null :
                                                            <DashLine backgroundColor="#F1F2F3" color="#F1F2F3" lineWidth={pxToDp(2)} borderStyle="solid" />
                                                    }
                                                </View>
                                            </Touchable>
                                        )
                                    })
                                }
                                <Touchable style={styles.seckillMore} onPress={() => this.gotoSeckillList()}>
                                    <Text style={styles.seckillMoreTitle}>查看更多</Text>
                                    <Image style={styles.seckillMoreImage} resizeMode="contain" source={require('../../images/next.png')} />
                                </Touchable>
                            </View> :
                            null
                    }
                    {
                        data && data.list.map((item, index) => (
                            <View style={[
                                styles.listItem,
                                item.style == 2 ? styles.paddingH_22 : '',
                                item.style == 1 || item.style == 2 ? styles.paddingB_24 : styles.paddingB_40,
                                item.style == 1 || item.style == 4 ? styles.paddingHorizontal : ''
                            ]} key={'list' + item.id}>
                                <View style={[
                                    styles.titleContainer,
                                    index == 0 ? styles.paddingT_40 : '',
                                    item.style == 1 ? styles.paddingB_24 : '',
                                    item.style == 2 ? styles.paddingH_18 : '',
                                    item.style == 4 ? styles.paddingB_20 : '',
                                    item.style == 3 ? styles.paddingB_40 : '',
                                    item.style == 3 ? styles.paddingHorizontal : ''
                                ]}>
                                    <Text style={{ flex: 1 }}></Text>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <Touchable style={styles.titleR} onPress={() => seeMore(item)}>
                                        <Text style={styles.titleMore}>查看更多</Text>
                                        <Image resizeMode="contain" style={styles.nextIcon} source={require('../../images/next.png')} />
                                    </Touchable>
                                </View>
                                {this.styleComponents(item)}
                            </View>
                        ))
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
    paddingT_40: {
        paddingTop: pxToDp(40),
    },
    paddingH_22: {
        paddingHorizontal: pxToDp(22)
    },
    paddingH_18: {
        paddingHorizontal: pxToDp(18)
    },
    paddingB_24: {
        paddingBottom: pxToDp(24)
    },
    paddingB_40: {
        paddingBottom: pxToDp(40)
    },
    paddingB_20: {
        paddingBottom: pxToDp(20)
    },
    paddingHorizontal: {
        paddingHorizontal: pxToDp(40)
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        flex: 3,
        fontSize: pxToDp(32),
        color: theme.color333,
        fontWeight: "400",
        textAlign: "center"
    },
    titleR: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    listItem: {
        backgroundColor: theme.colorWhite
    },
    titleMore: {
        fontSize: pxToDp(24),
        color: theme.color666,
        marginRight: pxToDp(10)
    },
    nextIcon: {
        width: pxToDp(10),
        height: pxToDp(18)
    },
    wrapper: {
        height: pxToDp(300)
    },
    banner: {
        width: '100%',
        height: "100%"
    },
    coupons: {
        padding: pxToDp(40),
        backgroundColor: theme.colorWhite,
        marginBottom: pxToDp(20)
    },
    couponsTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: pxToDp(32)
    },
    couponsTitleText: {
        fontSize: pxToDp(32),
        color: theme.color333
    },
    couponsTitleMore: {
        flexDirection: "row",
        alignItems: "center",
    },
    couponsTitleMoreText: {
        fontSize: pxToDp(24),
        color: theme.color666
    },
    marginRight_10: {
        marginRight: pxToDp(10)
    },
    fontSize_30: {
        fontSize: pxToDp(30),
    },
    couponList: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
        marginHorizontal: pxToDp(-16)
    },
    couponListItem: {
        width: "50%",
        height: pxToDp(136),
        paddingHorizontal: pxToDp(16)
    },
    couponBackground: {
        width: "100%",
        height: '100%',
    },
    couponBackgroundContainer: {
        padding: pxToDp(10),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    couponBackgroundContainerL: {
        flex: 1,
        alignItems: "center"
    },
    couponBackgroundContainerLPrice: {
        fontSize: pxToDp(40),
        color: theme.colorWhite
    },
    couponBackgroundContainerLRule: {
        fontSize: pxToDp(24),
        color: theme.colorWhite
    },
    couponBackgroundContainerLDeadline: {
        fontSize: pxToDp(24),
        color: theme.colorWhite
    },
    couponBackgroundContainerR: {
        paddingHorizontal: pxToDp(20)
    },
    receive: {
        fontSize: pxToDp(28),
        color: theme.colorWhite
    },
    seckill: {
        padding: pxToDp(40),
        backgroundColor: theme.colorWhite,
        marginBottom: pxToDp(20)
    },
    seckillTitle: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: pxToDp(20)
    },
    seckillTitleL: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    seckillTitleLImage: {
        width: pxToDp(48),
        height: pxToDp(48),
        marginRight: pxToDp(16)
    },
    seckillTitleLText: {
        fontSize: pxToDp(32),
        fontWeight: '500',
        color: theme.color333
    },
    seckillTitleR: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row",
    },
    seckillTitleRText: {
        fontSize: pxToDp(24),
        fontWeight: '500',
        color: theme.color333
    },
    seckillMore: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingTop: pxToDp(28)
    },
    seckillMoreTitle: {
        fontSize: pxToDp(24),
        fontWeight: '500',
        color: theme.color666,
        marginRight: pxToDp(10)
    },
    seckillMoreImage: {
        width: pxToDp(16),
        height: pxToDp(24)
    },
    seckillList: {
        flexDirection: "row",
        alignItems: "center",
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
    }
});

export default Pages;
