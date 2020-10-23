import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, pxToDp, theme } from '../utils'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');

class DiscountJump extends Component {
    static navigationOptions = {
        title: '优惠券商品',
    }
    constructor(props) {
        super(props);
        this.state = {
            Commodity: '',
            textinputcon: "",
            // 加载状态
            meauListLoad: true,
            coupon_id: ''
        };
    }
    componentDidMount() {
        this.initService();
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { coupon_id } } } } = this.props;
        dispatch({
            type: 'Mine/couponsproductslist',
            payload: {
                coupon_id: coupon_id,
                search: '',
                page: 1,
                pageSize: 10
            },
            callback: res => {
                if (res) {
                    this.setState({
                        coupon_id: coupon_id,
                        Commodity: res,
                        meauListLoad: false,
                    });
                }
            }
        })
    }
    Commodit(item) {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }))
    }
    Search = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'Mine/couponsproductslist',
            payload: {
                coupon_id: this.state.coupon_id,
                search: this.state.textinputcon,
                page: 1,
                pageSize: 10
            },
            callback: res => {
                if (res) {
                    this.setState({
                        Commodity: res
                    });
                }
            }
        })
    }
    render() {
        if (this.state.meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.searchbackground}>
                        <View style={styles.top}>
                            <View style={styles.searchframe}>
                                <Image style={styles.searchicon} source={require('../images/search.png')}></Image>
                                <View>
                                    <TextInput
                                        style={styles.searchtext}
                                        onChangeText={(textinputcon) => this.setState({ textinputcon })}
                                        value={this.state.textinputcon}
                                        placeholder="搜索商品，如腐乳等"
                                    />
                                </View>
                            </View>
                            <View style={styles.search}>
                                <Text style={styles.search_text} onPress={this.Search}>
                                    搜索
                                </Text>
                            </View>
                        </View>
                        {
                            this.state.Commodity == "" ?
                                <View style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image style={styles.nocommoditypic} source={require('../images/illustration_coupon.png')}></Image>
                                    <Text style={styles.notyet} >没有相关商品哦</Text>
                                </View>
                                :
                                <View>
                                    <Text style={styles.titletext}>相关商品</Text>
                                    <View style={styles.productlist}>
                                        {
                                            this.state.Commodity.map((item, Index) =>
                                                (
                                                    <Touchable style={styles.commoditybox} key={`commodity_${Index}`} onPress={() => this.Commodit(item)}>
                                                        <View style={styles.commodity}>
                                                            <Image style={styles.commodityimage} source={{ uri: item.thumb }}></Image>
                                                            <View style={styles.commoditydetails}>
                                                                <Text numberOfLines={1} style={styles.commoditytitle}><Text>{item.name}</Text></Text>
                                                                <Text numberOfLines={1} style={styles.commodityintroduce}>{item.product.keywords}</Text>
                                                                <Text style={styles.commodityprice}>{numeral(item.price).format('$0,0.00')}</Text>
                                                            </View>
                                                        </View>
                                                    </Touchable>
                                                )
                                            )
                                        }
                                    </View>
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
    searchbackground: {
        backgroundColor: "white",
        paddingBottom: pxToDp(40)
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingRight: pxToDp(40),
        paddingLeft: pxToDp(40),
        paddingTop: pxToDp(25),
        paddingBottom: pxToDp(55),
    },
    backgroundColor: {
        height: pxToDp(10),
        backgroundColor: theme.baseBackgroundColor,
        width: '100%',
    },
    searchframe: {
        width: '87%',
        height: pxToDp(70),
        backgroundColor: theme.baseBackgroundColor,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchicon: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginLeft: pxToDp(20),
    },
    searchtext: {
        width:pxToDp(490),
        fontSize: pxToDp(28),
        marginLeft: pxToDp(20),
        color: '#a3a8b0',
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20),
    },
    search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    titletext: {
        fontSize: pxToDp(36),
        textAlign: "center",
        marginTop: pxToDp(60),
        marginBottom: pxToDp(30),
        color: "#333"
    },

    productlist: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'space-between',
        paddingHorizontal: pxToDp(40)
    },
    commoditybox: {
        marginTop: pxToDp(30)
    },
    commodity: {
        width: pxToDp(320),
        borderWidth: pxToDp(1),
        borderColor: "black",
        borderStyle: "solid",
    },
    commodityimage: {
        width: "100%",
        paddingTop: "100%"
    },
    commoditydetails: {
        paddingVertical: pxToDp(15),
        paddingHorizontal: pxToDp(12),
    },
    commoditytitle: {
        fontSize: pxToDp(28),
        color: "#666",
        marginTop: pxToDp(10)
    },
    commodityintroduce: {
        fontSize: pxToDp(24),
        color: "#999",
        marginTop: pxToDp(10)
    },
    commodityprice: {
        fontSize: pxToDp(28),
        color: "#66bfb9",
        marginTop: pxToDp(10)
    },
    notyet: {
        fontSize: pxToDp(30),
        textAlign: 'center',
        color: 'black',
        paddingTop: pxToDp(40)
    },
    nocommoditypic: {
        width: pxToDp(300),
        height: pxToDp(140),
        marginTop: pxToDp(120),
    }
})

export default connect(({ Mine }) => ({ ...Mine }))(DiscountJump)
