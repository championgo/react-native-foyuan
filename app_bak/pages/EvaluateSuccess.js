import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, pxToDp, theme, Storage } from '../utils'
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');

class EvaluateSuccess extends Component {
    static navigationOptions = {
        title: '评价',
    }
    constructor(props) {
        super(props);
        this.state = {
            commodity: '',
            // 加载状态
            meauListLoad: true,
            Recommendation: ''
        };
    }
    async componentDidMount() {
        this.setState({
            Recommendation: await Storage.get('search')
        }, () => {
            this.initService();
        })
    }
    initService = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/record',
            payload: {
                history: this.state.Recommendation,
                num: 4
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        meauListLoad: false,
                        commodity: res.data,
                    })
                }
            }
        })
    }
    Commodit = (item) => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }))
    }
    Stroll = () => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'HomeBackup' }))
    }
    render() {
        if (this.state.meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.searchbackground}>
                        <Text style={styles.successtitle}>评价成功！</Text>
                        <View style={styles.searchcontent}>
                            <Text style={styles.Stroll} onPress={() => this.Stroll()}>随便逛逛</Text>
                        </View>
                        <Text style={styles.titletext}>猜你喜欢</Text>
                        <View style={styles.productlist}>
                            {
                                this.state.commodity.map((item, index) => (
                                    <Touchable style={styles.commoditybox} key={`commodity_${index}`} onPress={() => this.Commodit(item)}>
                                        <View style={styles.commodity}>
                                            <Image style={styles.commodityimage} source={{ uri: item.thumb }}></Image>
                                            <View style={styles.commoditydetails}>
                                                <Text numberOfLines={1} style={styles.commoditytitle}><Text>{item.name}</Text></Text>
                                                <Text numberOfLines={1} style={styles.commodityintroduce}>{item.product?.keywords}</Text>
                                                <Text style={styles.commodityprice}>{numeral(item.price).format('$0,0.00')}</Text>
                                            </View>
                                        </View>
                                    </Touchable>
                                ))
                            }
                        </View>
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
    searchcontent: {
        display: "flex",
        justifyContent: 'center',
        flexDirection: 'row',
    },
    Stroll: {
        width: pxToDp(300),
        height: pxToDp(100),
        backgroundColor: '#66bfb8',
        color: 'white',
        fontSize: pxToDp(30),
        borderRadius: pxToDp(4),
        textAlign: 'center',
        lineHeight: pxToDp(100)
    },
    successtitle: {
        textAlign: 'center',
        lineHeight: pxToDp(200),
        fontSize: pxToDp(48),
        color: 'black'
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
        lineHeight: pxToDp(280)
    }
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(EvaluateSuccess)
