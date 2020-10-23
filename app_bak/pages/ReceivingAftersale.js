import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TextInput, ImageBackground, Modal, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, pxToDp, theme } from '../utils';
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import { Textarea } from "native-base";
import ImagePicker from 'react-native-image-crop-picker';
import Config from '../config/index';
import Toast from 'react-native-tiny-toast';

class ReceivingAftersale extends Component {
    static navigationOptions = {
        title: '退换售后',
    }
    constructor(props) {
        super(props);
        this.state = {
            // 加载状态
            meauListLoad: true,
            // 金额输入
            valuetext: "",
            // 问题描述
            value: '',
            // 联系方式
            phototext: '',
            reasons: [],
            // 申请原因
            modalVisibleempty: false,
            Applicationreason: "请选择",
            reasoncon: '',
            tabIndex: 0,
            return_reason_id: '',
            // 申请诉求
            modalVisibleappeal: false,
            appealcontent: [
                { name: "退款", index: 1 },
                { name: "退货", index: 2 },
                { name: "换货", index: 3 },
            ],
            Appealreason: "请选择",
            Appealcon: '',
            Index: 0,
            appeal: "",
            // 是否收到商品
            modalVisiblereceived: false,
            receivecontent: [
                { name: "是", Idx: 1 },
                { name: '否', Idx: 0 }
            ],
            receivecon: "",
            idx: 0,
            is_product: '',
            Receivecon: "请选择",
            // 上传图片
            uploadimage: [],
            exchange: '',
            product_sku_id: '',
            order_id: ''
        };
    }
    componentDidMount() {
        this.initService();
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { order_id, product_sku_id } } } } = this.props;
        dispatch({
            type: 'Mine/after',
            payload: {
                id: order_id,
                product_sku_id: product_sku_id
            },
            callback: res => {
                if (res) {
                    this.setState({
                        meauListLoad: false,
                        reasons: res.reasons,
                        exchange: res.order,
                        order_id: order_id,
                        product_sku_id: product_sku_id
                    })
                }
            }
        })
    }
    // 申请诉求
    Appeal = () => {
        this.setState({
            modalVisibleappeal: true
        })
    }
    Appealchoice = (item, index) => {
        this.setState({
            Index: index,
            Appealcon: item.name,
            appeal: item.index
        })
    }
    AppealConfirm = () => {
        if (this.state.Appealcon == '') {
            this.setState({
                modalVisibleappeal: false,
                Appealreason: this.state.appealcontent[0].name,
                appeal: this.state.appealcontent[0].index
            })
        } else {
            this.setState({
                modalVisibleappeal: false,
                Appealreason: this.state.Appealcon,
                appeal: this.state.appeal
            })
        }
    }
    // 是否收到商品
    Whether = () => {
        this.setState({
            modalVisiblereceived: true
        })
    }
    Receivecontent = (item, index) => {
        this.setState({
            idx: index,
            receivecon: item.name
        })
    }
    ReceiveConfirm = () => {
        if (this.state.receivecon == "") {
            this.setState({
                Receivecon: this.state.receivecontent[0].name,
                is_product: this.state.receivecontent[0].Idx,
                modalVisiblereceived: false
            })
        } else {
            this.setState({
                Receivecon: this.state.receivecon,
                is_product: this.state.receivecontent.Idx,
                modalVisiblereceived: false
            })
        }
    }
    // 申请原因
    Application = () => {
        this.setState({
            modalVisibleempty: true
        })
    }
    Select = (item, Index) => {
        this.setState({
            tabIndex: Index,
            reasoncon: item.name,
            return_reason_id: item.id
        })
    }
    Confirm = () => {
        if (this.state.reasoncon == '') {
            this.setState({
                Applicationreason: this.state.reasons[0].name,
                return_reason_id: this.state.reasons[0].id,
                modalVisibleempty: false
            })
        } else {
            this.setState({
                Applicationreason: this.state.reasoncon,
                return_reason_id: this.state.return_reason_id,
                modalVisibleempty: false
            })
        }

    }
    // 取消
    Cancel = () => {
        this.setState({
            modalVisibleempty: false,
            modalVisiblereceived: false,
            modalVisibleappeal: false,
        })
    }
    // 上传图片
    Upload = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            includeBase64: true
        }).then(image => {
            let Image = 'data:image/png;base64,' + image.data;
            this.props.dispatch({
                type: `app/changeimg`,
                payload: {
                    image: Image,
                },
                callback: (res) => {
                    if (res.error == 0) {
                        let arr = this.state.uploadimage
                        arr.push(Config.apicommodity + res.data)
                        this.setState({
                            uploadimage: arr
                        })
                    }
                }
            })
        }).catch(res => {
            console.log(res)
        })
    }
    // 删除图片
    Delete = (item) => {
        this.props.dispatch({
            type: `Mine/deteteupload`,
            payload: {
                image: item.replace(Config.apicommodity, '')
            },
            callback: (res) => {
                if (res) {
                    let arr = this.state.uploadimage;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == item) {
                            arr.splice(i, 1);
                        }
                        this.setState({
                            uploadimage: arr,
                        });
                    }
                }
            }
        })
    }
    Submission = () => {
        if (this.state.valuetext > this.state.exchange?.product_real_price) {
            Toast.show('输入金额大于退款金额', {
                position: 0,
                duration: 2000,
            });
        } else {
            this.props.dispatch({
                type: `Mine/postReturn`,
                payload: {
                    amount: this.state.valuetext,
                    appeal: this.state.appeal,
                    description: this.state.value,
                    id: this.state.order_id,
                    images: JSON.stringify(this.state.uploadimage),
                    is_product: this.state.is_product,
                    phone: this.state.phototext,
                    product_sku_id: this.state.product_sku_id,
                    return_reason_id: this.state.return_reason_id
                },
                callback: (res) => {
                    console.log(res)
                    if (res) {
                        Toast.show('退换申请提交成功', {
                            position: 0,
                            duration: 2000,
                        });
                        this.props.navigation.goBack()
                        this.props.navigation.state.params.refresh();
                    }
                }
            })
        }
    }
    render() {
        if (this.state.meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <View style={styles.searchbackground}>
                            <View style={styles.After_sale_content}>
                                <Image style={styles.After_sale_pic} source={{ uri: this.state.exchange?.product_thumb }}></Image>
                                <View style={styles.After_sale_information}>
                                    <View style={styles.After_sale_information_title}>
                                        <Text style={styles.After_sale_title} numberOfLines={1}>{this.state.exchange?.product_name}</Text>
                                        <Text style={styles.After_sale_brief} numberOfLines={1}>{this.state.exchange?.product_spec[0]?.value}</Text>
                                        <Text style={styles.After_sale_price}>{numeral(this.state.exchange?.product_price).format('$0,0.00')}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.After_sale_information_number}>X{this.state.exchange?.product_num}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* 申诉述求 */}
                        <View style={styles.After_sale_reason}>
                            <View style={styles.After_sale_reason_con}>
                                <View style={styles.After_sale_reason_content_title}>
                                    <Text style={styles.After_sale_reason_con_title}>申诉述求</Text>
                                </View>
                                <Touchable style={styles.After_sale_reason_con_contnet} onPress={this.Appeal}>
                                    <View>
                                        <Text style={styles[this.state.Appealreason == "请选择" ? 'After_sale_reason_reason' : 'After_sale_reason_reasonno']}>{this.state.Appealreason}</Text>
                                    </View>
                                    <Image style={styles.After_sale_reason_arrow} source={require('../images/sale.png')}></Image>
                                </Touchable>
                            </View>
                            {/* 是否收到商品 */}
                            {
                                this.state.Appealreason == "换货" ?
                                    null
                                    :
                                    <View style={styles.After_sale_reason_con}>
                                        <View style={styles.After_sale_reason_content_title}>
                                            <Text style={styles.After_sale_reason_con_title}>是否收到商品</Text>
                                        </View>
                                        <Touchable style={styles.After_sale_reason_con_contnet} onPress={this.Whether}>
                                            <View>
                                                <Text style={styles[this.state.Receivecon == "请选择" ? 'After_sale_reason_reason' : 'After_sale_reason_reasonno']}>{this.state.Receivecon}</Text>
                                            </View>
                                            <Image style={styles.After_sale_reason_arrow} source={require('../images/sale.png')}></Image>
                                        </Touchable>
                                    </View>
                            }
                            {/* 退款金额 */}
                            {
                                this.state.Appealreason == "换货" ?
                                    null
                                    :
                                    <View style={styles.After_sale_reason_con}>
                                        <View style={styles.After_sale_reason_content_title}>
                                            <Text style={styles.After_sale_reason_con_title}>退款金额</Text>
                                        </View>
                                        <View style={styles.After_sale_reason_con_contnet}>
                                            <TextInput style={styles.TextInput_money}
                                                placeholder={"最多可输入" + this.state.exchange?.product_real_price + "元"}
                                                placeholderTextColor="#a3a8b0"
                                                onChangeText={(valuetext) => this.setState({ valuetext })}
                                                value={this.state.valuetext}
                                            />
                                        </View>
                                    </View>
                            }
                            {/* 申请原因 */}
                            <View style={styles.After_sale_reason_con}>
                                <View style={styles.After_sale_reason_content_title}>
                                    <Text style={styles.After_sale_reason_con_title}>申请原因</Text>
                                </View>
                                <Touchable style={styles.After_sale_reason_con_contnet} onPress={this.Application}>
                                    <View>
                                        <Text style={styles[this.state.Applicationreason == "请选择" ? 'After_sale_reason_reason' : 'After_sale_reason_reasonno']}>{this.state.Applicationreason}</Text>
                                    </View>
                                    <Image style={styles.After_sale_reason_arrow} source={require('../images/sale.png')}></Image>
                                </Touchable>
                            </View>
                            {/* 问题描述 */}
                            <View style={styles.salecontents}>
                                <View style={styles.title}>
                                    <Text style={styles.saletitle}>问题描述</Text>
                                </View>
                                <View style={styles.saleconchoiceinput}>
                                    <Textarea style={styles.Inputcon}
                                        placeholder="请描述您的问题"
                                        placeholderTextColor="#a3a8b0"
                                        onChangeText={(value) => this.setState({ value })}
                                        value={this.state.value}
                                    />
                                    <View style={styles.uploadpic}>
                                        {
                                            this.state.uploadimage.map((item, index) => (
                                                <View style={styles.Aftersalepic} key={`uploadimage_${index}`}>
                                                    <ImageBackground style={styles.uploadimg} source={{ uri: item }}>
                                                        <Text style={styles.detlet} onPress={() => this.Delete(item)}>X</Text>
                                                    </ImageBackground>
                                                </View>
                                            ))
                                        }
                                        {
                                            this.state.uploadimage.length < 3 ?
                                                <Touchable style={styles.Aftersalepic} onPress={() => this.Upload()}>
                                                    <ImageBackground style={styles.uploadpictrue} source={require('../images/upload.png')}></ImageBackground>
                                                </Touchable>
                                                : null
                                        }
                                    </View>
                                </View>
                            </View>
                            {/* 联系方式 */}
                            <View style={styles.After_sale_reason_con}>
                                <View style={styles.After_sale_reason_content_title}>
                                    <Text style={styles.After_sale_reason_con_title}>联系方式</Text>
                                </View>
                                <View style={styles.After_sale_reason_con_contnet}>
                                    <TextInput style={styles.TextInput_money}
                                        placeholder="请输入你的联系方式"
                                        placeholderTextColor="#a3a8b0"
                                        onChangeText={(phototext) => this.setState({ phototext })}
                                        value={this.state.phototext}
                                    />
                                </View>
                            </View>
                            <View style={{ width: "100%", height: pxToDp(30) }}></View>
                        </View>

                        <View style={styles.submission}>
                            {
                                (this.state.Appealreason != "请选择" && this.state.Applicationreason != "请选择" && this.state.Receivecon != "请选择" && this.state.valuetext != "") || (this.state.Appealreason == "换货" && this.state.Applicationreason != "请选择") ?
                                    <Text style={styles.submissionbutton} onPress={this.Submission}>提交</Text>
                                    :
                                    <Text style={styles.submissionbuttonon}>提交</Text>
                            }

                        </View>
                    </View>
                </ScrollView>
                {/* 申请诉求 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisibleappeal}
                    onRequestClose={() => this.setState({ modalVisibleappeal: false })}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisibleappeal: false })}>
                            <View style={styles.commoditynumber}>
                                <View style={styles.empatycommodity}>
                                    <View style={styles.confirmbutton}>
                                        <Text style={styles.titlecon} onPress={this.Cancel}>取消</Text>
                                        <Text style={styles.titlecon} onPress={this.AppealConfirm}>确认</Text>
                                    </View>
                                    <View style={styles.Afterreasons}>
                                        {
                                            this.state.appealcontent.map((item, index) => (
                                                <View style={styles.appealcontent} key={`appealcontent_${index}`}>
                                                    <Text style={styles[this.state.Index == index ? 'appeal_contentno' : 'appeal_content']} onPress={() => this.Appealchoice(item, index)}>{item.name}</Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </Modal>
                {/* 是否收到商品 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisiblereceived}
                    onRequestClose={() => this.setState({ modalVisiblereceived: false })}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisiblereceived: false })}>
                            <View style={styles.commoditynumber}>
                                <View style={styles.empatycommodity}>
                                    <View style={styles.confirmbutton}>
                                        <Text style={styles.titlecon} onPress={this.Cancel}>取消</Text>
                                        <Text style={styles.titlecon} onPress={this.ReceiveConfirm}>确认</Text>
                                    </View>
                                    <View style={styles.Afterreasons}>
                                        {
                                            this.state.receivecontent.map((item, index) => (
                                                <View style={styles.receivedcontent} key={`receivecontent_${index}`}>
                                                    <Text style={styles[this.state.idx == index ? 'appeal_contentno' : 'appeal_content']} onPress={() => this.Receivecontent(item, index)}>{item.name}</Text>
                                                </View>
                                            ))
                                        }

                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </Modal>
                {/* 弹出申请原因 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisibleempty}
                    onRequestClose={() => this.setState({ modalVisibleempty: false })}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisibleempty: false })}>
                            <View style={styles.commoditynumber}>
                                <View style={styles.empatycommodity}>
                                    <View style={styles.confirmbutton}>
                                        <Text style={styles.titlecon} onPress={this.Cancel}>取消</Text>
                                        <Text style={styles.titlecon} onPress={this.Confirm}>确认</Text>
                                    </View>
                                    <View style={styles.Afterreasons}>
                                        {
                                            this.state.reasons.map((item, Index) => (
                                                <Text style={styles[this.state.tabIndex == Index ? "reasonsconslect" : "reasonscon"]} onPress={() => this.Select(item, Index)} key={`reasons_${Index}`}>{item.name}</Text>
                                            ))
                                        }
                                    </View>
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
    searchbackground: {
        width: "100%",
        height: pxToDp(180),
        backgroundColor: "white",
        display: 'flex',
        justifyContent: 'center',
    },
    After_sale_content: {
        paddingHorizontal: pxToDp(40),
        flexDirection: "row",
        height: pxToDp(120),
        justifyContent: 'space-between',
    },
    After_sale_pic: {
        width: pxToDp(120),
        height: pxToDp(120),
        backgroundColor: 'pink',
        borderRadius: pxToDp(4)
    },
    After_sale_information: {
        width: pxToDp(530),
        height: pxToDp(120),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    After_sale_information_title: {
        width: pxToDp(470),
        justifyContent: 'space-between',
    },
    After_sale_title: {
        fontSize: pxToDp(30),
        color: '#2d2d2d'
    },
    After_sale_brief: {
        fontSize: pxToDp(24),
        color: '#a3a8b0'
    },
    After_sale_price: {
        fontSize: pxToDp(24)
    },
    After_sale_information_number: {
        lineHeight: pxToDp(120),
        fontSize: pxToDp(24)
    },
    After_sale_reason: {
        marginTop: pxToDp(10),
        width: "100%",
        backgroundColor: "white"
    },
    After_sale_reason_con: {
        paddingHorizontal: pxToDp(40),
        marginTop: pxToDp(30),
        height: pxToDp(80),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    After_sale_reason_content_title: {
        width: pxToDp(160),
    },
    After_sale_reason_con_title: {
        fontSize: pxToDp(30),
    },
    After_sale_reason_con_contnet: {
        width: pxToDp(500),
        height: pxToDp(76),
        backgroundColor: "#f8f8f8",
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: pxToDp(30),
        alignItems: 'center'
    },
    After_sale_reason_reason: {
        fontSize: pxToDp(30),
        color: '#a3a8b0'
    },
    After_sale_reason_reasonno: {
        fontSize: pxToDp(30),
        color: 'black'
    },
    After_sale_reason_arrow: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginRight: pxToDp(30)
    },
    TextInput_money: {
        width: "100%",
        height: pxToDp(76),
        fontSize: pxToDp(30)
    },

    saleconchoiceinput: {
        width: pxToDp(500),
        height: pxToDp(440),
        paddingLeft: pxToDp(14),
        backgroundColor: "#f8f8f8",
    },
    dropdownImage: {
        width: pxToDp(60),
        height: pxToDp(30),
    },
    dropdown: {
        width: pxToDp(30),
        height: pxToDp(30),
    },
    Inputcon: {
        fontSize: pxToDp(30),
        width: pxToDp(500),
        height: pxToDp(270),
    },
    uploadpic: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: pxToDp(130),
        paddingVertical: pxToDp(20)
    },
    Aftersalepic: {
        width: pxToDp(130),
        height: pxToDp(130),
        marginLeft: pxToDp(20),
        flexDirection: 'row',
    },
    uploadimg: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: 'flex-end',
        flexDirection: "row"
    },
    detlet: {
        width: pxToDp(40),
        height: pxToDp(40),
        backgroundColor: "rgba(0,0,0,0.5)",
        textAlign: "center",
        lineHeight: pxToDp(40),
        fontSize: pxToDp(30),
        color: 'white'
    },
    salecontents: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: pxToDp(40),
        marginTop: pxToDp(30),
    },
    saletitle: {
        fontSize: pxToDp(30),
        lineHeight: pxToDp(80)
    },
    title: {
        height: pxToDp(80),
    },
    uploadpictrue: {
        width: "100%",
        height: "100%"
    },
    // 提交
    submission: {
        width: "100%",
        height: pxToDp(180),
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center'
    },
    submissionbutton: {
        width: pxToDp(440),
        height: pxToDp(100),
        borderRadius: pxToDp(4),
        backgroundColor: '#66bfb8',
        textAlign: 'center',
        lineHeight: pxToDp(100),
        fontSize: pxToDp(30),
        color: 'white'
    },
    submissionbuttonon: {
        width: pxToDp(440),
        height: pxToDp(100),
        borderRadius: pxToDp(4),
        backgroundColor: '#66bfb8',
        opacity: 0.5,
        textAlign: 'center',
        lineHeight: pxToDp(100),
        fontSize: pxToDp(30),
        color: 'white'
    },
    // 弹窗
    commoditynumber: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 100,
    },
    empatycommodity: {
        width: "100%",
        height: pxToDp(480),
        backgroundColor: "white",
        position: 'absolute',
        left: 0,
        bottom: 0
    },
    confirmbutton: {
        width: '100%',
        height: pxToDp(80),
        borderStyle: 'solid',
        borderBottomColor: "#a3a8b0",
        borderBottomWidth: pxToDp(2),
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row'
    },
    titlecon: {
        paddingHorizontal: pxToDp(40),
        fontSize: pxToDp(36),
        color: "#66bfb8",
        lineHeight: pxToDp(80)
    },
    Afterreasons: {
        paddingHorizontal: pxToDp(40),
        paddingVertical: pxToDp(20),
        height: pxToDp(400),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    reasonscon: {
        fontSize: pxToDp(30),
        paddingHorizontal: pxToDp(15),
        borderRadius: pxToDp(4),
        paddingVertical: pxToDp(6),
        backgroundColor: "#f2f2f2",
        marginTop: pxToDp(10),
        marginRight: pxToDp(30),
        color: 'black'
    },
    reasonsconslect: {
        fontSize: pxToDp(30),
        paddingHorizontal: pxToDp(15),
        borderRadius: pxToDp(4),
        paddingVertical: pxToDp(6),
        backgroundColor: "#66bfb8",
        marginTop: pxToDp(10),
        marginRight: pxToDp(30),
        color: "white"
    },
    appealcontent: {
        width: "100%",
        height: pxToDp(120),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    receivedcontent: {
        width: "100%",
        height: pxToDp(180),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    appeal_content: {
        width: pxToDp(200),
        height: pxToDp(70),
        borderRadius: pxToDp(6),
        backgroundColor: '#f2f2f2',
        color: 'black',
        textAlign: 'center',
        lineHeight: pxToDp(70),
        fontSize: pxToDp(30)
    },
    appeal_contentno: {
        width: pxToDp(200),
        height: pxToDp(70),
        borderRadius: pxToDp(6),
        backgroundColor: '#66bfb8',
        color: 'white',
        textAlign: 'center',
        lineHeight: pxToDp(70),
        fontSize: pxToDp(30)
    }
})

export default connect(({ Mine }) => ({ ...Mine }))(ReceivingAftersale)
