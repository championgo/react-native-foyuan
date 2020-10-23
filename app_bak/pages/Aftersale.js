import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TextInput, Modal, TouchableWithoutFeedback, ImageBackground, DeviceEventEmitter } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, pxToDp, theme } from '../utils'
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import { Textarea } from "native-base";
import { compose } from 'redux'
import ImagePicker from 'react-native-image-crop-picker';
import Config from '../config/index'

class Aftersale extends Component {
    static navigationOptions = {
        title: '退换售后',
    }
    constructor(props) {
        super(props);
        this.state = {
            // 问题描述
            value: "",
            // 联系方式
            valuetext: '',
            modalVisibleempty: false,
            // 退换的原因
            reasons: "",
            reasoncon: '',
            return_reason_id: "",
            reason: "请选择",
            meauListLoad: true,
            tabIndex: 0,
            uploadimage: [],
            order: ""
        };
    }
    componentDidMount() {
        this.initService();
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        dispatch({
            type: 'Mine/after',
            payload: {
                id
            },
            callback: res => {
                if (res) {
                    this.setState({
                        meauListLoad: false,
                        reasons: res.reasons,
                        order: res.order,
                    })
                }
            }
        })
    }
    // 申诉原因弹窗
    Appealreason = () => {
        this.setState({
            modalVisibleempty: true
        })
    }
    // 选择申诉原因
    Select = (item, Index) => {
        this.setState({
            tabIndex: Index,
            reasoncon: item.name,
            return_reason_id: item.id
        })
    }
    // 取消
    Cancel = () => {
        this.setState({
            modalVisibleempty: false
        })
    }
    // 确认
    Confirm = () => {
        if (this.state.reasoncon == "") {
            this.setState({
                reason: this.state.reasons[0].name,
                return_reason_id: this.state.reasons[0].id,
                modalVisibleempty: false
            })
        } else {
            this.setState({
                reason: this.state.reasoncon,
                return_reason_id: this.state.return_reason_id,
                modalVisibleempty: false
            })
        }
    }
    // 上传
    Upload() {
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
    // 删除上传图片 
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

    // 提交
    Submitbut = () => {
        this.props.dispatch({
            type: `Mine/aftersubmission`,
            payload: {
                description: this.state.value,
                image: JSON.stringify(this.state.uploadimage),
                order_id: this.state.order.order_id,
                phone: this.state.valuetext,
                return_reason_id: this.state.return_reason_id,
            },
            callback: (res) => {
                if (res) {
                    this.props.navigation.goBack()
                    this.props.navigation.state.params.refresh();
                }
            }
        });
    }
    render() {
        const { uploadimage, meauListLoad } = this.state
        if (meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.searchbackground}>
                        <View style={styles.salecontent}>
                            <View>
                                <Text style={styles.saletitle}>申请诉求</Text>
                            </View>
                            <View style={styles.salecon}>
                                <Text style={styles.salecontitle}>取消订单</Text>
                            </View>
                        </View>
                        <View style={styles.salecontent}>
                            <View>
                                <Text style={styles.saletitle}>申请原因</Text>
                            </View>
                            <Touchable style={styles.saleconchoice} onPress={this.Appealreason}>
                                <Text style={styles[this.state.reason == "请选择" ? "salecontitle" : "salecontitlec"]}>{this.state.reason}</Text>
                                <View style={styles.dropdownImage}>
                                    <Image style={styles.dropdown} source={require('../images/sale.png')}></Image>
                                </View>
                            </Touchable>
                        </View>

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
                                        uploadimage.map((item) => (
                                            <View style={styles.Aftersalepic} key={`uploadimage_${index}`}>
                                                <ImageBackground style={styles.uploadimg} source={{ uri: item }}>
                                                    <Text style={styles.detlet} onPress={() => this.Delete(item)}>X</Text>
                                                </ImageBackground>
                                            </View>
                                        ))
                                    }
                                    {
                                        uploadimage.length < 3 ?
                                            <Touchable style={styles.Aftersalepic} onPress={() => this.Upload()}>
                                                <ImageBackground style={styles.uploadpictrue} source={require('../images/upload.png')}></ImageBackground>
                                            </Touchable>
                                            : null
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={styles.salecontent}>
                            <View>
                                <Text style={styles.saletitle}>联系方式</Text>
                            </View>
                            <View style={styles.salecon}>
                                <TextInput style={styles.textipntcon}
                                    placeholder="请输入你的联系方式"
                                    placeholderTextColor="#a3a8b0"
                                    onChangeText={(valuetext) => this.setState({ valuetext })}
                                    value={this.state.valuetext}
                                />
                            </View>
                        </View>

                        <View style={styles.Submit}>
                            {
                                this.state.return_reason_id == "" ?
                                    <Text style={styles.Submitbuttonno}>提交</Text>
                                    :
                                    <Text style={styles.Submitbutton} onPress={this.Submitbut}>提交</Text>
                            }
                        </View>
                    </View>
                </ScrollView>
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
        paddingHorizontal: pxToDp(40),
        paddingVertical: pxToDp(30),
    },
    salecontent: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: pxToDp(80),
        alignItems: 'center',
        marginBottom: pxToDp(40)
    },
    salecontents: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: pxToDp(40)
    },
    saletitle: {
        fontSize: pxToDp(30),
        lineHeight: pxToDp(80)
    },
    salecon: {
        width: pxToDp(460),
        height: pxToDp(80),
        justifyContent: 'center'
    },

    salecontitlec: {
        fontSize: pxToDp(30),
        color: "black"
    },
    saleconchoice: {
        width: pxToDp(460),
        height: pxToDp(80),
        justifyContent: 'space-between',
        flexDirection: "row",
        alignItems: 'center'
    },
    saleconchoiceinput: {
        width: pxToDp(460),
        paddingRight: pxToDp(30),
        fontSize: pxToDp(30)
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
        width: pxToDp(430),
        height: pxToDp(270),
    },
    uploadpic: {
        marginTop: pxToDp(20),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    },
    Aftersalepic: {
        width: pxToDp(120),
        height: pxToDp(120),
        marginRight: pxToDp(30),
        flexDirection: 'row'
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
    textipntcon: {
        width: pxToDp(460),
        fontSize: pxToDp(30),
    },
    Submit: {
        height: pxToDp(100),
        display: 'flex',
        alignItems: 'center'
    },
    Submitbutton: {
        width: pxToDp(480),
        height: pxToDp(100),
        backgroundColor: '#66bfb8',
        fontSize: pxToDp(30),
        color: 'white',
        borderRadius: pxToDp(4),
        lineHeight: pxToDp(100),
        textAlign: 'center'
    },
    Submitbuttonno: {
        width: pxToDp(480),
        height: pxToDp(100),
        backgroundColor: '#66bfb8',
        fontSize: pxToDp(30),
        color: 'white',
        borderRadius: pxToDp(4),
        lineHeight: pxToDp(100),
        textAlign: 'center',
        opacity: 0.4
    },
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
    uploadpictrue: {
        width: "100%",
        height: "100%"
    },
})

export default connect(({ Mine }) => ({ ...Mine }))(Aftersale)
