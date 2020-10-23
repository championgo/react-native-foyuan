import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, pxToDp, theme } from '../utils';
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');

class AftersalesProcess extends Component {
    static navigationOptions = {
        title: '售后进程',
    }
    constructor(props) {
        super(props);
        this.state = {
            // 加载状态
            meauListLoad: true,
            traces: [],
            photo: 'tel:13914259886',
            setpheigth: '',
            setpsheigth: ''
        };
    }
    componentDidMount() {
        this.initService();
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { order_id, product_sku_id, type } } } } = this.props;
        dispatch({
            type: 'Mine/getTraces',
            payload: {
                id: order_id,
                product_sku_id: type == 0 ? "undefined" : product_sku_id
            },
            callback: res => {
                if (res) {
                    this.setState({
                        meauListLoad: false,
                        traces: res.traces,
                    });
                }
            }
        });
    }
    // 联系客服
    Contact = () => {
        Linking.canOpenURL(this.state.photo).then(supported => {
            if (supported) {
                return Linking.openURL(this.state.photo);
            } else {
                Toast.show({
                    text: '该设备不支持电话功能',
                    position: 'center',
                    type: 'warning',
                    duration: 3000
                });
            }
        });
    }
    // 总盒子高度
    onLayout = (event) => {
        this.setState({
            setpheigth: event.nativeEvent.layout.height,
        })
    }
    // 小绿点高度
    onLayou = (event) => {
        this.setState({
            setpsheigth: event.nativeEvent.layout.height,
        })
    }

    render() {
        const { meauListLoad, traces } = this.state;
        if (meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.searchbackground}>
                        <View style={styles.head}>
                            <Text style={styles.service_time}>服务时间：12:30-13:30</Text>
                            <Touchable style={styles.contact_service} onPress={this.Contact}>
                                <Image style={styles.contact_service_pic} source={require('../images/Online_contact.png')}></Image>
                                <Text style={styles.contact_service_name}>联系客服</Text>
                            </Touchable>
                        </View>
                    </View>
                    <View style={styles.bar}></View>
                    <View style={styles.speed_of_progress}>
                        {
                            traces.map((item, index) => (
                                <View style={styles.speed_of_progress_content} key={`traces_${index}`}>
                                    <View style={styles.timer}>
                                        <Text style={styles.timertime}>{item.updated_at}</Text>
                                    </View>
                                    <View style={styles.speed_of_progress_stats} onLayout={(event) => this.onLayout(event)}>
                                        <View style={styles.speed_of_progress_stats_kong} onLayout={(event) => this.onLayou(event)}>
                                            <View style={styles.speed_of_progress_stats_origin}></View>
                                        </View>
                                        {
                                            traces.length == 1 || traces.length - 1 == index ?
                                                null
                                                :
                                                <View style={{ position: 'absolute', top: pxToDp(26), left: pxToDp(7), height: this.state.setpheigth - this.state.setpsheigth, width: pxToDp(2), backgroundColor: "#A3A8B0", }}></View>
                                        }
                                    </View>
                                    <View style={styles.Procee_content}>
                                        <Text style={styles.Acceptance_content}>{item.action_value?.content}</Text>
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
        backgroundColor: 'white'
    },
    searchbackground: {
        width: "100%",
        height: pxToDp(100),
    },
    head: {
        paddingHorizontal: pxToDp(40),
        display: 'flex',
        justifyContent: "space-between",
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(100)
    },
    service_time: {
        fontSize: pxToDp(26),
        color: "#a3a8b0"
    },
    contact_service: {
        flexDirection: 'row'
    },
    contact_service_pic: {
        width: pxToDp(38),
        height: pxToDp(38)
    },
    contact_service_name: {
        fontSize: pxToDp(30),
        marginLeft: pxToDp(10)
    },
    bar: {
        width: '100%',
        height: pxToDp(10),
        backgroundColor: theme.baseBackgroundColor,
    },
    speed_of_progress: {
        paddingHorizontal: pxToDp(40),
        marginTop: pxToDp(50)
    },
    speed_of_progress_content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timer: {
        width: pxToDp(160),
        paddingBottom: pxToDp(30)
    },
    timertime: {
        fontSize: pxToDp(24),
        color: '#a3a8b0'
    },
    speed_of_progress_stats: {
        width: pxToDp(16),
        height: "100%",
        position: 'relative',
    },
    speed_of_progress_stats_kong: {
        width: pxToDp(16),
        height: pxToDp(26)
    },
    speed_of_progress_stats_origin: {
        width: pxToDp(16),
        height: pxToDp(16),
        borderRadius: pxToDp(50),
        backgroundColor: '#66bfb8',
        marginTop: pxToDp(10)
    },
    Procee_content: {
        width: pxToDp(500),
        paddingLeft: pxToDp(40),
        paddingBottom: pxToDp(30)
    },
    Acceptance_content: {
        fontSize: pxToDp(30),
    }

})

export default connect(({ Mine }) => ({ ...Mine }))(AftersalesProcess)
