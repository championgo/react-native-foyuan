import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, pxToDp, theme } from '../utils'
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');

class TrackingLogistics extends Component {
    static navigationOptions = {
        title: '追踪物流',
    }
    constructor(props) {
        super(props);
        this.state = {
            // 加载状态
            meauListLoad: true,
            logistics: ''
        };
    }
    componentDidMount() {
        this.initService();
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        dispatch({
            type: 'Mine/getShippingPacke',
            payload: {
                order_id: id,
                product_sku_id: ''
            },
            callback: res => {
                if (res) {
                    this.setState({
                        meauListLoad: false,
                        logistics: res
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
                    <View>
                        {
                            this.state.logistics.map((item, index) =>
                                (
                                    <View style={styles.content} key={`logistics_${index}`}>
                                        <View style={styles.order_situation}>
                                            <Text style={styles.order_num}>包裹{index + 1}</Text>
                                            <Text style={styles.order_number}>{item.company}：{item.shipping_number}</Text>
                                        </View>
                                        <View style={styles.commodity}>
                                            <Image style={styles.order_pic} source={{ uri: item.products[0] }}></Image>
                                            <Text style={styles.order_pic_number}>共{item.number}件</Text>
                                        </View>
                                    </View>
                                ))
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
    content: {
        paddingHorizontal: pxToDp(40),
        marginBottom: pxToDp(20)
    },
    order_situation: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        height: pxToDp(88)
    },
    order_num: {
        fontSize: pxToDp(30),
        color: '#2d2d2d',
        lineHeight: pxToDp(88)
    },
    order_number: {
        fontSize: pxToDp(30),
        color: '#a3a8b0',
        lineHeight: pxToDp(88)
    },
    order_pic: {
        width: pxToDp(120),
        height: pxToDp(120),
        backgroundColor: 'red'
    },
    order_pic_number: {
        fontSize: pxToDp(30),
        color: '#2d2d2d',
        marginLeft: pxToDp(30)
    },
    commodity: {
        display: 'flex',
        flexDirection: 'row'
    }

})

export default connect(({ Mine }) => ({ ...Mine }))(TrackingLogistics)
