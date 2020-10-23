import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, pxToDp, theme } from '../utils';
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');

class HomeMore extends Component {
    static navigationOptions = {
        title: '更多商品',
    }
    constructor(props) {
        super(props);
        this.state = {
            commodity: [],
            commoditytitle: [],
            textinputcon: "",
            // 加载状态
            meauListLoad: true
        };
    }
    componentDidMount() {
        this.initService();
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        dispatch({
            type: 'commodityModel/homemore',
            payload: {
                id
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        meauListLoad: false,
                        commodity: res.data.product,
                        commoditytitle: res.data.plate
                    })
                }
            }
        })
    }
    Commodit(item) {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }))
    }
    Search = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        dispatch({
            type: 'commodityModel/homemore',
            payload: {
                id,
                title: this.state.textinputcon
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        commodity: res.data.product,
                        commoditytitle: res.data.plate
                    })
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
                        <Text style={styles.titletext}>{this.state.commoditytitle.name}</Text>
                        <View style={styles.productlist}>
                            {this.state.commodity.map((item, index) => (
                                <Touchable style={styles.commoditybox} key={`commodity_${index}`} onPress={() => this.Commodit(item)}>
                                    <View style={styles.commodity}>
                                        <Image style={styles.commodityimage} source={{ uri: item.thumb }}></Image>
                                        <View style={styles.commoditydetails}>
                                            <Text numberOfLines={1} style={styles.commoditytitle}><Text>{item.title}</Text></Text>
                                            <Text numberOfLines={1} style={styles.commodityintroduce}>{item.keywords}</Text>
                                            <Text style={styles.commodityprice}>{numeral(item.money).format('$0,0.00')}</Text>
                                        </View>
                                    </View>
                                </Touchable>
                            ))}
                        </View>
                        {
                            this.state.commodity == "" ?
                                <View>
                                    <Text style={styles.notyet}>未搜索到此商品！</Text>
                                </View>
                                : null
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
        paddingBottom: pxToDp(20),
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
        width: pxToDp(490),
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
        marginTop: pxToDp(30),
        marginBottom: pxToDp(30),
        color: "#333",
    },
    productlist: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'space-between',
        paddingHorizontal: pxToDp(40)
    },
    commoditybox: {
        marginTop: pxToDp(20)
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
        lineHeight: pxToDp(280)
    }
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(HomeMore)
