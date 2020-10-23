import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Image,
    SafeAreaView,
    Text,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, pxToDp, theme } from '../utils'
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import { Tab, Tabs } from 'native-base';

class AllEvaluate extends Component {
    static navigationOptions = {
        title: '评论',
    }
    constructor(props) {
        super(props);
        this.state = {
            // 头部导航切换
            Tab: [
                { name: "全部", val: 1, isMore: true, loadingMore: false, page: 1 },
                { name: '有图', val: 2, isMore: true, loadingMore: false, page: 1 },
                { name: '追评', val: 3, isMore: true, loadingMore: false, page: 1 }
            ],
            index: 0,
            status: 0,
            pageSize: 5,
            Evaluatecon: [],
            modalVisiblenumb: false,
            loading: false,
            Imagepic: '',
            picheight: ''
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
        const { dispatch, navigation: { state: { params } } } = this.props;
        const { status, pageSize, Evaluatecon, index, Tab, } = this.state;

        if (loadingMore) {
            Tab[index].loadingMore = true;
        } else {
            if (Evaluatecon[index]) {
                return;
            }
        }
        this.setState({
            loading,
            Tab
        }, () => {
            dispatch({
                type: "commodityModel/getComments",
                payload: {
                    product_id: params,
                    search: status,
                    page: Tab[index].page,
                    pageSize
                },
                callback: res => {
                    if (loadingMore) {
                        Evaluatecon[index] = [...Evaluatecon[index], ...res];
                    } else {
                        Evaluatecon[index] = res.data;
                    };

                    if (res.length >= pageSize) {
                        Tab[index].page += 1;
                    } else {
                        Tab[index].isMore = false;
                    };

                    Tab[index].loadingMore = false;

                    this.setState({
                        Evaluatecon,
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
    // 评论tab切换
    Onchang = (tab) => {
        this.setState({
            index: tab.i,
            status: this.state.Tab[tab.i].val
        }, () => {
            this.initServe(false);
        });
    }

    Item(item) {
        const numArr = [0, 1, 2, 3, 4];
        return (
            <View style={styles.couponListItem}>
                <View style={styles.head_content}>
                    <View style={styles.head_pic}>
                        <Image style={styles.head_pictrue} source={{ uri: item.user?.head_img }}></Image>
                    </View>
                    <View style={styles.user_con}>
                        <View style={styles.user_con_name}>
                            <View>
                                <Text style={styles.evaluate_name}>{item.user?.name}</Text>
                            </View>
                            <View style={styles.evaluate_stars}>
                                {
                                    numArr.map((Index) => <Image style={styles.Image_stars} source={Index >= item.rating ? require('../images/noscore.png') : require('../images/score.png')} key={`numArr_${Index}`}></Image>)
                                }
                            </View>
                        </View>
                        <View>
                            <Text style={styles.evaluate_time}>{item.diff}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.evaluate_content}>
                    <Text style={styles.evaluate_content_con}>{item.content}</Text>
                    {
                        item.images?.length >= 1 ?
                            <View style={styles.evaluate_content_pic}>
                                {
                                    item.images.map((itam, idx) => (
                                        <Touchable key={`image_${idx}`} onPress={() => this.ImageShow(itam)}>
                                            <Image style={styles.Image_pic} source={{ uri: itam }}></Image>
                                        </Touchable>
                                    ))
                                }
                            </View>
                            : null
                    }
                </View>
            </View>
        )
    }
    // 上拉加载
    _ListEmptyComponent = () => {
        return (
            !!this.state.Evaluatecon[this.state.index] ?
                <View style={styles.couponsnumber}>
                    <Text style={styles.nocouponsnumbertitle}>没有追评的内容哦</Text>
                </View>
                :
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: pxToDp(100) }}>
                    <Loading />
                </View>
        )
    }
    // 底部组件
    _ListFooterComponent = () => {
        const { Tab, index, Evaluatecon } = this.state;
        if (!Evaluatecon[index] || Evaluatecon[index].length <= 0) {
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
    // 图片展示
    ImageShow = (itam) => {
        let Imageresult = [];
        Image.getSize(itam, (width, height) => {   //处理图片自适应的方法
            const myheight = Math.floor(theme.screenWidth * height / width);
            Imageresult.push({ "image": itam, picheight: myheight });
            this.setState({
                modalVisiblenumb: true,
                Imagepic: Imageresult[0].image,
                picheight: Imageresult[0].picheight
            })
        });
    }
    render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <Tabs tabBarUnderlineStyle={{ backgroundColor: "rgba(0,0,0,0)" }} onChangeTab={(tab) => this.Onchang(tab)}>
                    {
                        this.state.Tab.map((item) => (
                            <Tab heading={item.name}
                                activeTabStyle={{ backgroundColor: "#66bfb8" }}
                                tabStyle={{ backgroundColor: 'white' }}
                                activeTextStyle={{ color: 'white' }}
                                textStyle={{ color: "black" }}>
                                <FlatList
                                    data={this.state.Evaluatecon[this.state.index]}
                                    renderItem={({ item }) => this.Item(item)}
                                    keyExtractor={Item => Item.id}
                                    onEndReached={this.onEndReached}
                                    ListFooterComponent={this._ListFooterComponent}
                                    onEndReachedThreshold={0.2}
                                    ListEmptyComponent={this._ListEmptyComponent}
                                />
                                <View style={{ width: '100%', height: pxToDp(30) }}></View>
                            </Tab>
                        ))
                    }
                </Tabs>

                {/* 图片展示 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisiblenumb}
                    onRequestClose={() => this.setState({ modalVisiblenumb: false })}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisiblenumb: false })}>
                            <View style={styles.commoditynumber}>
                                <View style={styles.commoditytpic}>
                                    <Image style={{ width: '100%', height: this.state.picheight }} source={{ uri: this.state.Imagepic }}></Image>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
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
    couponListItem: {
        paddingHorizontal: pxToDp(40),
        marginTop: pxToDp(30),
        marginBottom: pxToDp(10)
    },
    head_content: {
        height: pxToDp(90),
        display: "flex",
        flexDirection: 'row',
    },
    head_pic: {
        width: pxToDp(80),
        height: pxToDp(90),
        display: 'flex',
        justifyContent: 'center',
    },
    head_pictrue: {
        width: pxToDp(80),
        height: pxToDp(80),
        borderRadius: pxToDp(50),
    },
    user_con: {
        marginLeft: pxToDp(30),
        display: 'flex',
        justifyContent: "space-between",
    },
    user_con_name: {
        height: pxToDp(40),
        justifyContent: 'center',
        flexDirection: 'row'
    },
    evaluate_name: {
        fontSize: pxToDp(30),
        color: 'black',
        lineHeight: pxToDp(40)
    },
    evaluate_stars: {
        marginLeft: pxToDp(20),
        justifyContent: 'center',
        flexDirection: 'row'
    },
    Image_stars: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginTop: pxToDp(5)
    },
    evaluate_time: {
        fontSize: pxToDp(24),
        color: "#a3a8b0"
    },
    evaluate_content: {
        marginLeft: pxToDp(110),
        marginTop: pxToDp(10)
    },
    evaluate_content_con: {
        fontSize: pxToDp(30),
        color: 'black'
    },
    evaluate_content_pic: {
        marginTop: pxToDp(10),
        flexDirection: 'row'
    },
    Image_pic: {
        width: pxToDp(160),
        height: pxToDp(160),
        marginRight: pxToDp(20),
    },
    couponsnumber: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: pxToDp(30)
    },
    nocouponsnumbertitle: {
        fontSize: pxToDp(24),
        color: "#a3a8b0",
        textAlign: 'center',
        marginTop: pxToDp(60)
    },
    noMore: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: pxToDp(20)
    },
    noMoreText: {
        color: theme.color666,
        fontSize: pxToDp(30)
    },
    commoditynumber: {
        width: "100%",
        height: "100%",
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commoditytpic: {
        width: "100%",
    }
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(AllEvaluate)
