import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TextInput, Modal, Alert, Platform, PermissionsAndroid } from 'react-native';
import { connect } from 'react-redux';
import * as wechat from 'react-native-wechat-lib';
import { NavigationActions, pxToDp, theme, Storage, seckillStatus } from '../utils';
import Swiper from 'react-native-swiper';
import RNFS from 'react-native-fs';
import CameraRoll from "@react-native-community/cameraroll";
import CountDown from 'react-native-countdown-component';
import Config from '../config';
const apiDomain = Config[Config.dev].apiDomain;
import Touchable from '../components/Touchable';
import { Loading, Button } from '../components';
import Toaste from 'react-native-tiny-toast';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import moment from 'moment';
import { Root, Toast } from "native-base";

class SeckillDetails extends Component {
    static navigationOptions = {
        title: '秒杀商品详情',
    }
    constructor(props) {
        super(props);
        this.state = {
            tabActiveIndex: 0,
            // 规格选择弹出
            modalVisible: false,
            // 客服弹出
            tabIndex: 0,
            inputtext: 1,
            Showcon: [],
            // 商品详情的顶部banner
            banner: [],
            //商品详情介绍
            fulltext: [],
            // 店铺图标名称
            shop: [],
            //购买商品的id
            product_sku_id: "",
            Imagecommodity: [],
            // 加载状态
            meauListLoad: true,
            // 秒杀时间过期
            beoverdue: '',
            seckill_product_id: "",
            property: '',
            // 规格选择判断
            Selected: "",
            // 个人信息
            Information: '',
            // 是否是分销商品
            is_distribution: '',
            // 活动结束时间
            activityend: '',
            // 倒计时时间
            Seckilltime: '',
            datas: 0,
            // 判断时间状态
            timestate: "",
            shareModalVisible: false, // share modal
        }
    }
    async componentDidMount() {
        this.showProduct()
        this.setState({
            Information: await Storage.get("user_info")
        })
    }
    showProduct = () => {
        const { dispatch, navigation: { state: { params: { id, sku_id } } } } = this.props;
        dispatch({
            type: 'commodityModel/showProduct',
            payload: {
                seckill_product_id: id || 10,
                id: sku_id || 255
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        meauListLoad: false,
                        Showcon: res.data,
                        banner: res.data.sku.product.images,
                        fulltext: res.data.sku.product.product_content.fulltext,
                        shop: res.data.sku.product.shop,
                        properties: res.data.properties,
                        seckill_product_id: res.data.sku.seckill_product_id,
                        is_distribution: res.data.sku.is_distribution,
                        activityend: res.data.seckill.end,
                    }, () => {
                        this.Imagecommoeity();
                        this.Activitytime();
                    })
                }
            }
        })
    }
    // 活动时间
    Activitytime = () => {
        let seckilltime = moment(this.state.activityend).diff(moment(), 'seconds') //moment(结束时间).diff(moment(开始时间))
        this.setState({
            Seckilltime: seckilltime,
            datas: 1
        })
        if (seckillStatus(moment(), this.state.activityend) == 1) {
            this.setState({
                timestate: 1
            })
        } else if (seckillStatus(moment(), this.state.activityend) == 3) {
            this.setState({
                timestate: 3
            })
        }
        if (seckilltime > 1) {
            this.setState({
                beoverdue: 0
            })
        } else {
            this.setState({
                beoverdue: 1
            })
        }
    }
    // 商品选择
    Productchoicename = (idx, itam) => {
        this.setState({
            property: [{ property_id: itam.property_id, property_value: itam.property_value }]
        }, () => {
            const { dispatch } = this.props;
            dispatch({
                type: 'commodityModel/getProperty',
                payload: {
                    property: this.state.property,
                    seckill_product_id: this.state.seckill_product_id
                },
                callback: res => {
                    if (res.error === 0) {
                        this.setState({
                            commodityicon: res.data.sku.thumb,
                            price: res.data.sku.price,
                            product_sku_id: res.data.sku.id,
                            tabcommodityindex: idx,
                            Selected: 1
                        })
                    }
                }
            })
        })
    }
    // 客服开启
    Customer = () => {
        if (this.state.tabIndex == 0) {
            this.setState({
                tabIndex: 1,
            })
        } else if (this.state.tabIndex == 1) {
            this.setState({
                tabIndex: 0,
            })
        }
    }
    // 立即购买
    Purchase = () => {
        if (this.state.Selected == 1) {
            this.setState({
                modalVisible: false
            }, () => {
                const { dispatch } = this.props;
                const { product_sku_id, inputtext, seckill_product_id } = this.state;
                const params = {
                    product_sku_id,
                    num: inputtext,
                    seckill_product_id,
                };
                dispatch(NavigationActions.navigate({ routeName: 'Settlement', params }));
            })
        } else {
            Toast.show({
                text: "请选择商品规格",
                duration: 2000,
                textStyle: { textAlign: 'center', height: pxToDp(70), lineHeight: pxToDp(70) },
            })
        }
    }
    // 商品数量的减
    decrease() {
        if (this.state.inputtext > 1) {
            this.setState({
                inputtext: this.state.inputtext - 1
            })
        }
    }
    // 商品数量的加
    increase() {
        this.setState({
            inputtext: this.state.inputtext + 1
        })
    }
    // 猜你喜欢跳转
    Likegoods(item) {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }))
    }
    // 富文本正则
    Imagecommoeity = async () => {
        let result = [], tamp;
        const arrrer = this.state.fulltext.match(/<p(.*?)<\/p>/g); //获取p标签里面的所有内容
        for (let i = 0; i < arrrer.length; i++) {
            const imgReg = /<img/;  //判断img正则
            const temp = imgReg.test(arrrer[i]);
            if (temp) {
                const patt = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;   //取出img正则
                if ((tamp = patt.exec(arrrer[i])) != null) {   //把图片取出来的方法
                    await Image.getSize(tamp[1], (width, height) => {   //处理图片自适应的方法
                        const myheight = Math.floor(theme.screenWidth * height / width);
                        result.push({ type: "image", "container": tamp[1], height: myheight })
                    });
                }
            } else {
                const content = arrrer[i].replace(/<(?!img).*?>/g, '').replace(/&nbsp;/ig, '').replace(/&quot;/ig, '')
                result.push({ type: "text", "container": content })
            }
        }
        this.setState({
            Imagecommodity: result
        })
    }
    // 富文本渲染
    CommentImg = (item, index) => {
        if (item.type == "image") {
            return (
                <Image style={styles.Imagecommodity, { height: item.height }} resizeMode="contain" source={{ uri: item.container }} key={`Imagecommodity_${index}`}></Image>
            )
        } else if (item.type == "text") {
            return (
                <Text key={`Imagecommodity_${index}`}>{item.container}</Text>
            )
        }
    }
    // 店铺页面a
    shophome = (a) => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: 'ShopHome', params: a }));
    }
    // 规格选择开启
    Specificationscheched = () => {
        this.setState({
            modalVisible: true
        })
    }
    // 规格选择关闭
    Specificationscheche = () => {
        this.setState({
            modalVisible: false
        })
    }
    Overdue = () => {
        this.setState({
            beoverdue: 1
        }, () => {
            Toaste.show('秒杀时间已过期敬请下次期待', {
                position: 0,
                duration: 2000,
            });
        })
    }

    /**
     * 分享modal
     */
    shareModal = (flag = false) => {
        this.setState({
            shareModalVisible: !!flag
        });
    }

    /**
     * 分享
     * @param {*} scene 方式 -> 0:会话 1:朋友圈 2:收藏, default 0
     */
    share = (scene = 0) => {
        const { Showcon } = this.state;
        const { navigation: { state: { params: { id, sku_id } } } } = this.props;
        this.shareModal(false);
        wechat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                // 分享到朋友
                wechat.shareWebpage({
                    title: Showcon?.sku?.product?.title,
                    description: '匠心好物—千挑万选，只想给你最好的。',
                    thumbImageUrl: Showcon?.sku?.thumb,
                    webpageUrl: `${apiDomain}weixin/seckill-detail/${encodeURI(JSON.stringify({ seckill_product_id: id, id: sku_id }))}`,
                    scene,
                }).then(res => {
                    if (res.errCode == 0) {
                        Toaste.show('分享成功', {
                            position: 0,
                            duration: 2000,
                        });
                    } else {
                        Toaste.show(`分享失败：${JSON.stringify(res.errStr)}`, {
                            position: 0,
                            duration: 2000,
                        });
                    }
                }).catch(err => {
                    Toaste.show(`分享失败：${JSON.stringify(err)}`, {
                        position: 0,
                        duration: 2000,
                    });
                });
            } else {
                Platform.OS == 'ios' ?
                    Alert.alert('没有安装微信', '是否安装微信？', [
                        { text: '取消' },
                        { text: '确定', onPress: () => this.installWechat() }
                    ]) :
                    Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
                        { text: '确定' }
                    ]);
            }
        });
    }

    /**
     * 保存确认
     */
    saveConfirm = () => {
        Alert.alert('提示  ', '确定保存照片到相册？',
            [
                {
                    text: " 取消", onPress: () => {
                        return
                    }
                },
                {
                    text: "确定", onPress: () => {
                        if (Platform.OS === 'ios') {
                            this.saveImg()
                        } else {
                            this.saveImgInAndroid()
                        }
                    }
                },
            ]
        )
    }

    /**
     * 检测Android权限
     */
    hasAndroidPermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    /**
     * ios保存图片
     */
    saveImg = async () => {
        const prefix = 'assets-library';
        const uri = await CameraRoll.save(`${apiDomain}weixin/assets/imgs/kefu.png`, 'photo');
        if (uri && uri.indexOf(prefix) === 0) {
            Toaste.show('图片已保存至相册', {
                position: 0,
                duration: 2000,
            });
        } else {
            Toaste.show('保存失败', {
                position: 0,
                duration: 2000,
            });
        };
    }

    /**
     * 安卓保存图片
     */
    saveImgInAndroid = async () => {
        if (Platform.OS === "android" && !(await this.hasAndroidPermission())) {
            return;
        };
        const storeLocation = `${RNFS.ExternalDirectoryPath}`; //安卓ExternalDirectoryPath才是挂载的外置存储，可被用户随意查看
        let pathName = new Date().getTime() + "_kefu.png"
        let downloadDest = `${storeLocation}/${pathName}`;
        const ret = RNFS.downloadFile({ fromUrl: `${apiDomain}weixin/assets/imgs/kefu.png`, toFile: downloadDest });
        ret.promise.then(res => {
            if (res && res.statusCode == 200) {
                CameraRoll.save(`file://${downloadDest}`, 'photo')
                    .then(function (result) {
                        Toaste.show('图片已保存至相册', {
                            position: 0,
                            duration: 2000,
                        });
                    }).catch(function (error) {
                        Toaste.show('保存失败', {
                            position: 0,
                            duration: 2000,
                        });
                    });
            }
        });
    }


    render() {
        const { shareModalVisible } = this.state;
        if (this.state.meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container} >
                <ScrollView ref={(view) => { this.myScrollView = view; }}>
                    <View onLayout={event => { this.layout = event.nativeEvent.layout }}>
                        {/* 轮播图 */}
                        <View style={styles.rotation}>
                            <Swiper style={styles.wrapper} showsButtons={false} autoplay autoplayTimeout={2.5} showsPagination={false}>
                                {this.state.banner.slice(0, 3).map((item, index) => (
                                    <View style={styles.slide} key={`banner_${index}`}>
                                        <Image style={styles.bannerimage} source={{ uri: Config.apicommodity + item.img }}></Image>
                                    </View>
                                ))}
                            </Swiper>
                        </View>
                        {/* 秒杀时间 */}
                        <View style={styles.Seckilldetails}>
                            <View style={styles.Seckilldetailstitle}>
                                <Image style={styles.clock} source={require('../images/seckilltime.png')}></Image>
                                <Image style={styles.seckilltitle} resizeMode="contain" source={require('../images/seckilltitle.png')}></Image>
                            </View>
                            {
                                this.state.beoverdue == 1 ?
                                    <View style={styles.Seckilldetailstime}>
                                        <Text style={styles.end}>{this.state.timestate == 1 ? "活动未开始" : "活动已结束"}</Text>
                                    </View>
                                    :
                                    <View style={styles.Seckilldetailstime}>
                                        <Text style={styles.distance}>距结束</Text>
                                        {
                                            this.state.datas == 1 ?
                                                <CountDown
                                                    size={10}
                                                    until={this.state.Seckilltime}
                                                    onFinish={this.Overdue}
                                                    digitStyle={{ backgroundColor: '#FFF' }}
                                                    digitTxtStyle={{ color: '#FF7941', fontSize: pxToDp(26) }}
                                                    separatorStyle={{ color: '#FFf', paddingHorizontal: pxToDp(4) }}
                                                    timeToShow={['D', 'H', 'M', 'S']}
                                                    timeLabels={{ m: null, s: null }}
                                                    showSeparator
                                                />
                                                : null
                                        }
                                    </View>
                            }
                        </View>
                        {/* 分销，商品名 */}
                        <View style={styles.Commoditysituation}>
                            {
                                this.state.Information.distributor_status == 2 && this.state.is_distribution == 1 ?
                                    <View>
                                        <Text style={styles.distributionco}>分销</Text>
                                    </View>
                                    : null
                            }
                            <View>
                                <Text style={styles.commoditytit}>{this.state.Showcon.sku.product.title}</Text>
                            </View>
                        </View>
                        {/* 商品价格，分享，收藏 */}
                        <View style={styles.Commoditydetailing}>
                            <View style={styles.CommodityDetail}>
                                <View style={styles.commoditybox}>
                                    <Text style={styles.commodityprice}>{numeral(this.state.Showcon.sku.seckill_price).format('$0,0.00')}</Text>
                                </View>
                                <View style={styles.commoditybutton}>
                                    <Text style={styles.share}></Text>
                                    <Text style={styles.share} onPress={() => this.shareModal(true)}>
                                        <View style={styles.sharebox}>
                                            <Image style={styles.Collectionimage} source={require('../images/fenxiang.png')}></Image>
                                        </View>
                                        <View style={styles.sharetitle}>
                                            <Text style={styles.Collectiontit}>分享</Text>
                                        </View>
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: "100%", height: pxToDp(10), backgroundColor: theme.baseBackgroundColor, marginTop: pxToDp(30) }}></View>

                        {/* 选择规格，运费 */}
                        <View style={styles.select}>
                            <View style={styles.allchoice}>
                                <Text style={styles.chociechoice}>运费</Text>
                                <Text style={styles.specifications}>{this.state.Showcon.freight}</Text>
                                <Touchable style={styles.arrowcon}>
                                    <Text style={styles.detailscon}></Text>
                                    <Text style={styles.arrow}></Text>
                                </Touchable>
                            </View>
                            {
                                this.state.beoverdue == 0 ?
                                    <Touchable onPress={this.Specificationscheched}>
                                        <View style={styles.allchoice}>
                                            <Text style={styles.chociechoice}>选择</Text>
                                            <Text style={styles.specificationscolor}>规格</Text>
                                            <Touchable style={styles.arrowcon}>
                                                <Text style={styles.detailscon}></Text>
                                                <Image style={styles.arrow} source={require('../images/next.png')}></Image>
                                            </Touchable>
                                        </View>
                                    </Touchable>
                                    :
                                    <Touchable>
                                        <View style={styles.allchoice}>
                                            <Text style={styles.chociechoice}>选择</Text>
                                            <Text style={styles.specificationscolor}>规格</Text>
                                            <Touchable style={styles.arrowcon}>
                                                <Text style={styles.detailscon}></Text>
                                                <Image style={styles.arrow} source={require('../images/next.png')}></Image>
                                            </Touchable>
                                        </View>
                                    </Touchable>
                            }
                        </View>
                        <View style={{ width: "100%", height: pxToDp(10), backgroundColor: theme.baseBackgroundColor, marginTop: pxToDp(20) }}></View>

                        {/* 店铺主页 */}
                        <Touchable onPress={() => this.shophome(this.state.shop)}>
                            <View style={styles.shoppage}>
                                <View style={styles.shopcontent}>
                                    <View style={styles.shopimage}>
                                        <Image style={styles.shopimage} source={{ uri: this.state.shop.logo }}></Image>
                                    </View>
                                    <View style={styles.shopnames}>
                                        <Text style={styles.shopname}>{this.state.shop.title}</Text>
                                    </View>
                                    <View style={styles.shopbox}>
                                        <Text style={styles.shophomepagejump}>店铺主页</Text>
                                        <Image style={styles.shoparrow} source={require('../images/next.png')}></Image>
                                    </View>
                                </View>
                            </View>
                        </Touchable>
                        <View style={{ width: "100%", height: pxToDp(10), backgroundColor: theme.baseBackgroundColor, marginTop: pxToDp(20) }}></View>

                        {/* 商品详情，猜你喜欢切换 */}
                        <View style={styles.Detailswitch}>
                            <View style={styles.switchtitle}>
                                <Text style={styles.detailtitle} >
                                    <Text style={styles.detailcolor}>商品详情</Text>
                                </Text>
                            </View>
                            <View style={styles.Selectstate}>
                                <View style={styles.selectbox}>
                                    <View style={styles.Selectunderline}></View>
                                </View>
                                <View style={styles.selectbox}>
                                </View>
                            </View>
                            <View style={styles.selectcontent}>
                                <View style={styles[this.state.tabActiveIndex == 1 ? 'detailscontent' : '']}>
                                    <View style={styles.commodityintroduce}>
                                        {this.state.Imagecommodity.map((item, index) => this.CommentImg(item, index))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {/* 底部导航栏 */}
                <View style={styles.bottonmenu} >
                    <View style={styles.navcon}>
                        <Touchable onPress={this.Customer}>
                            <View style={styles.navcustomerimage}>
                                <Text>
                                    <Image style={styles.navcustomericon} source={require('../images/customerservice.png')}></Image>
                                </Text>
                            </View>
                            <View style={styles.navcontenttitlebox}>
                                <Text style={styles.navcontenttitle}>客服</Text>
                            </View>
                        </Touchable>
                    </View>
                    {
                        this.state.beoverdue == 0 ?
                            <Text style={styles.purchase} onPress={this.Specificationscheched}>立即秒杀</Text>
                            :
                            <Text style={styles.purchasee}>{this.state.timestate == 1 ? "活动未开始" : "活动已结束"}</Text>
                    }
                </View>
                {/* 选择规格 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.Choicecommodity}>
                            <View style={styles.ejectcontent} >
                                <View style={styles.eject}>
                                    <View style={styles.commoditypic}>
                                        <Image style={styles.commodityicon} source={{ uri: this.state.Showcon.sku.thumb }}></Image>
                                    </View>
                                    <View style={styles.commoditypicon}>
                                        <View style={styles.signout}>
                                            <Touchable onPress={this.Specificationscheche}>
                                                <Image style={styles.outbutton} source={require('../images/closes.png')}></Image>
                                            </Touchable>
                                        </View>
                                        <View style={styles.commoditypiccontent}>
                                            <Text style={styles.commoditypiccontenttitle}>{this.state.Showcon.sku.product.title}</Text>
                                            <View style={styles.commoditypicconprice}>
                                                <Text style={styles.seckill_price}>{numeral(this.state.Showcon.sku.seckill_price).format('$0,0.00')}</Text>
                                                <View style={styles.removeprice}>
                                                    <Text style={styles.original_price}>{numeral(this.state.Showcon.sku.price).format('$0,0.00')}</Text>
                                                    <Text style={styles.removebar}></Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* 规格 */}
                                {Object.keys(this.state.properties).map((item, index) => (
                                    <View style={styles.Specifications} key={`properties_${index}`}>
                                        <View style={{ marginTop: pxToDp(20) }}>
                                            <Text style={styles.specificationstitle}>{item}</Text>
                                        </View>
                                        <View style={styles.specificationsstyle}>
                                            {
                                                this.state.properties[item].map((itam, idx) => (
                                                    <View key={`propertiesitam_${idx}`}>
                                                        <Text style={styles[this.state.tabcommodityindex == idx ? "producttypenamech" : "producttypename"]} onPress={() => this.Productchoicename(idx, itam)}>{itam.property_value}</Text>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    </View>
                                ))}
                                {/* 数量 */}
                                <View style={styles.productnumber}>
                                    <Text style={styles.productnumbertitle}>数量</Text>
                                    <Text style={styles.numberminussign} onPress={this.decrease.bind(this)}>-</Text>
                                    <TextInput value={String(this.state.inputtext)} style={{ height: 40, width: 40, fontSize: pxToDp(30), textAlign: "center" }} onChangeText={(inputtext) => this.setState({ inputtext: Number(inputtext) == "" ? '' : Number(inputtext) })} />
                                    <Text style={styles.numberminussign} onPress={this.increase.bind(this)}>+</Text>
                                </View>
                                <Root>
                                    <View style={styles.produectchoicestate}>
                                        <Text style={styles.purchaseproduect} onPress={this.Purchase}>立即购买</Text>
                                    </View>
                                </Root>
                            </View>
                        </View >
                    </SafeAreaView>
                </Modal>
                {/* 客服 */}
                {
                    this.state.tabIndex == 1 ?
                        <View style={styles.Customer_service}>
                            <Touchable onPress={this.Customer}>
                                <Image style={styles.customercolse} source={require('../images/icin_delete.png')}></Image>
                            </Touchable>
                            <Touchable
                                onLongPress={() => this.saveConfirm()}
                            >
                                <Image
                                    style={styles.customercode}
                                    resizeMode="cover"
                                    source={{ uri: apiDomain + 'weixin/assets/imgs/kefu.png' }}
                                />
                            </Touchable>
                            <Text style={styles.codefontsize}>您好，如需咨询，请长按保存上方二维码添加客服微信。如保存失败请搜索微信号：13914259886。</Text>
                        </View>
                        : null
                }
                <Modal visible={shareModalVisible} animationType="fade" transparent>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.shareModal}>
                            <View style={styles.shareModalContainer}>
                                <View style={styles.shareModalContainerContent}>
                                    <View style={styles.shareModalBtnsContainer}>
                                        <Touchable style={styles.shareModalBtns} onPress={() => this.share()}>
                                            <Image source={require('../images/wechat.png')} resizeMode="contain" style={styles.shareModalBtnsIcon} />
                                        </Touchable>
                                        <Text style={styles.shareModalBtnsText}>微信好友</Text>
                                    </View>
                                    <View style={styles.shareModalBtnsContainer}>
                                        <Touchable style={styles.shareModalBtns} onPress={() => this.share(1)}>
                                            <Image source={require('../images/moments.png')} resizeMode="contain" style={styles.shareModalBtnsIcon} />
                                        </Touchable>
                                        <Text style={styles.shareModalBtnsText}>朋友圈</Text>
                                    </View>
                                </View>
                                <Button text="取消" style={styles.shareModalBtnCancel} textStyle={styles.shareModalBtnCancelText} onPress={() => this.shareModal(false)} />
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    // 轮播图
    rotation: {
        width: "100%",
        height: pxToDp(540),
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        width: "100%",
        height: pxToDp(540),
    },
    bannerimage: {
        width: "100%",
        height: pxToDp(540)
    },
    Seckilldetails: {
        width: "100%",
        height: pxToDp(100),
        display: 'flex',
        flexDirection: 'row',
    },
    Seckilldetailstitle: {
        width: "50%",
        height: pxToDp(100),
        backgroundColor: "#FF7941",
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    Seckilldetailstime: {
        width: "50%",
        height: pxToDp(100),
        backgroundColor: "#FFAA64",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    end: {
        width: "100%",
        fontSize: pxToDp(28),
        lineHeight: pxToDp(100),
        textAlign: 'center',
        color: "black"
    },
    clock: {
        width: pxToDp(40),
        height: pxToDp(40),
        
    },
    seckilltitle: {
        height: pxToDp(46),
        marginLeft: pxToDp(20)
    },
    distance: {
        fontSize: pxToDp(28),
        color: '#fff',
        marginRight: pxToDp(20)
    },

    // 分销，商品名
    Commoditysituation: {
        marginHorizontal: pxToDp(40),
        paddingVertical: pxToDp(20),
        marginTop: pxToDp(10),
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    distributionco: {
        color: "#FF8400",
        backgroundColor: "#FFE7BA",
        fontSize: pxToDp(28),
        paddingHorizontal: pxToDp(20),
        borderRadius: pxToDp(10),
        height: pxToDp(40),
        marginRight: pxToDp(20)
    },
    commoditytit: {
        width: pxToDp(540),
        fontSize: pxToDp(32),
        lineHeight: pxToDp(40),
        flexWrap: 'wrap',
    },
    // 商品价格，分享，收藏
    Commoditydetailing: {
        paddingHorizontal: pxToDp(40),
        height: pxToDp(70),
    },
    CommodityDetail: {
        paddingTop: pxToDp(10),
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    commoditybox: {
        width: pxToDp(250),
        height: pxToDp(70),
        justifyContent: "center",
    },
    commodityprice: {
        fontSize: pxToDp(42),
        color: "#66bfb8",
    },
    commoditybutton: {
        width: pxToDp(160),
        height: pxToDp(70),
        flexDirection: "row",
    },
    share: {
        width: pxToDp(80),
        height: pxToDp(70),
        flexWrap: "wrap",
    },
    sharebox: {
        width: pxToDp(80),
        height: pxToDp(40),
    },
    sharetitle: {
        width: pxToDp(80),
        height: pxToDp(30),
    },
    collect: {
        width: pxToDp(80),
        height: pxToDp(70),
    },
    Collectionimage: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginLeft: pxToDp(30),
    },
    Collectiontit: {
        textAlign: "right",
        fontSize: pxToDp(26),
    },
    // 选择规格，运费
    select: {
        paddingHorizontal: pxToDp(40),
        marginTop: pxToDp(50),
    },
    allchoice: {
        paddingBottom: pxToDp(30),
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    chociechoice: {
        width: pxToDp(100),
        fontSize: pxToDp(30),
        lineHeight: pxToDp(40),
        color: '#A3A8B0'
    },
    specificationscolor: {
        width: pxToDp(460),
        fontSize: pxToDp(30),
        lineHeight: pxToDp(40),
    },
    specifications: {
        width: pxToDp(460),
        fontSize: pxToDp(30),
        lineHeight: pxToDp(40),
    },
    specificationszi: {
        color: "#FA551D"
    },
    arrowimage: {
        width: pxToDp(25),
        height: pxToDp(40),
    },
    arrow: {
        width: pxToDp(20),
        height: pxToDp(24),
        marginTop: pxToDp(8)
    },
    arrowcon: {
        width: pxToDp(100),
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    detailscon: {
        width: pxToDp(70),
        fontSize: pxToDp(30),
        lineHeight: pxToDp(40),
        color: "rgb(163, 168, 176)",
        textAlign: 'right',
    },
    // 店铺主页
    shoppage: {
        marginHorizontal: pxToDp(40),
        marginVertical: pxToDp(50),
    },
    shopcontent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    shopimage: {
        width: pxToDp(100),
        height: pxToDp(100)
    },
    shopnames: {
        width: pxToDp(380)
    },
    shopname: {
        fontSize: pxToDp(30),
        lineHeight: pxToDp(100),
    },
    shopbox: {
        flexDirection: "row",
    },
    shophomepagejump: {
        color: "#a3a8b0",
        lineHeight: pxToDp(100),
        fontSize: pxToDp(30),
        paddingRight: pxToDp(20)
    },
    shoparrow: {
        width: pxToDp(14),
        height: pxToDp(26),
        marginTop: pxToDp(37),
    },
    // 商品详情，猜你喜欢切换
    Detailswitch: {
        marginHorizontal: pxToDp(40),
        marginVertical: pxToDp(50),
        marginBottom: pxToDp(150)
    },
    switchtitle: {
        display: "flex",
        flexDirection: "row"
    },

    detailtitle: {
        width: "50%",
        height: pxToDp(70),
        lineHeight: pxToDp(70),
        fontSize: pxToDp(28),
        color: "#2d2d2d",
        display: 'flex',
        alignItems: "center"
    },
    detailcolor: {
        color: "black"
    },
    nodetailcolor: {
        color: '#A3A8B0'
    },
    Selectstate: {
        width: "100%",
        flexDirection: "row"
    },
    selectbox: {
        width: "50%",
        height: pxToDp(4),
    },
    Selectunderline: {
        width: pxToDp(125),
        height: pxToDp(4),
        backgroundColor: "#64c0ba",
    },
    selectcontent: {
        width: "100%",
        marginTop: pxToDp(10)
    },
    detailscontent: {
        display: "none",
    },
    commodityintroduce: {
        width: "100%",
    },
    Imagecommodity: {
        width: "100%",
    },
    likecommdity: {
        width: "100%",
        display: 'flex',
        flexDirection: "row",
        paddingTop: pxToDp(20)
    },
    likeintroduce: {
        width: 100 / 3 + "%",
        paddingHorizontal: pxToDp(10),
    },
    commodityImage: {
        width: "100%",
        paddingTop: "100%"
    },
    commodityname: {
        paddingTop: pxToDp(10),
        fontSize: pxToDp(30),
    },
    commodityslogan: {
        paddingTop: pxToDp(10),
        fontSize: pxToDp(24),
        color: "#a3a8b0"
    },
    commodityprices: {
        fontSize: pxToDp(30),
        color: '#66bfb8',
        paddingTop: pxToDp(10),
    },
    // 底部菜单栏
    bottonmenu: {
        width: "100%",
        height: pxToDp(100),
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row"
    },
    navcon: {
        width: "20%",
        height: pxToDp(100),
    },
    purchase: {
        width: "80%",
        lineHeight: pxToDp(100),
        fontSize: pxToDp(30),
        color: "white",
        textAlign: "center",
        backgroundColor: "#FF7941"
    },
    purchasee: {
        width: "80%",
        lineHeight: pxToDp(100),
        fontSize: pxToDp(30),
        color: "white",
        textAlign: "center",
        backgroundColor: "#A3A8B0"
    },
    navcustomerimage: {
        width: "100%",
        height: pxToDp(34),
        alignItems: "center",
        marginTop: pxToDp(15)
    },

    navcustomericon: {
        width: pxToDp(30),
        height: pxToDp(30)
    },
    navcontenttitlebox: {
        width: "100%",
        height: pxToDp(34),
        alignItems: "center",
    },
    navcontenttitle: {
        fontSize: pxToDp(21),
        color: "#a3a8b0"
    },
    // 选择规格，立即购买，加入购买
    Choicecommodity: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "absolute",
        top: 0,
        left: 0,
    },
    ejectcontent: {
        width: "100%",
        backgroundColor: "white",
        position: "absolute",
        bottom: 0,
        left: 0,
        paddingTop: pxToDp(40),
    },
    eject: {
        height: pxToDp(120),
        position: "relative",
        marginHorizontal: pxToDp(40),
    },
    commoditypic: {
        width: pxToDp(210),
        height: pxToDp(210),
        position: "absolute",
        left: 0,
        bottom: 0,
    },
    commodityicon: {
        width: pxToDp(210),
        height: pxToDp(210)
    },
    commoditypicon: {
        width: pxToDp(430),
        height: pxToDp(120),
        position: "absolute",
        right: 0,
        top: 0,
    },
    signout: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row"
    },
    outbutton: {
        width: pxToDp(36),
        height: pxToDp(36),
    },

    commoditypiccontent: {
        width: "100%",
        height: pxToDp(80),
        marginTop: pxToDp(4),
        display: 'flex',
        justifyContent: 'space-between'
    },
    commoditypiccontenttitle: {
        fontSize: pxToDp(30)
    },
    commoditypicconprice: {
        fontSize: pxToDp(28),
        flexDirection: 'row'
    },
    seckill_price: {
        fontSize: pxToDp(30),
        color: 'rgb(255,130,110)'
    },
    removeprice: {
        position: 'relative',
        marginLeft: pxToDp(30),
    },
    original_price: {
        fontSize: pxToDp(30),
        color: 'black',
    },
    removebar: {
        width: "100%",
        height: pxToDp(2),
        position: 'absolute',
        top: "48%",
        left: 0,
        backgroundColor: 'black'
    },
    Specifications: {
        marginTop: pxToDp(50),
        paddingHorizontal: pxToDp(40),
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    specificationstitle: {
        fontSize: pxToDp(30),
        lineHeight: pxToDp(70),
    },
    specificationsstyle: {
        width: pxToDp(580),
        flexDirection: "row",
        flexWrap: 'wrap'
    },

    producttypename: {
        fontSize: pxToDp(24),
        paddingHorizontal: pxToDp(20),
        paddingVertical: pxToDp(15),
        backgroundColor: "#f2f2f2",
        marginRight: pxToDp(20),
        marginTop: pxToDp(20),
        borderRadius: pxToDp(10),
        color: "black"
    },
    producttypenamech: {
        fontSize: pxToDp(24),
        paddingHorizontal: pxToDp(20),
        paddingVertical: pxToDp(15),
        backgroundColor: "rgb(255, 121, 65)",
        marginRight: pxToDp(20),
        marginTop: pxToDp(20),
        borderRadius: pxToDp(10),
        color: "white"
    },

    productnumber: {
        marginTop: pxToDp(50),
        height: pxToDp(90),
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: pxToDp(150),
        paddingHorizontal: pxToDp(40),

    },
    productnumbertitle: {
        fontSize: pxToDp(30),
        marginRight: pxToDp(30)
    },
    numberminussign: {
        width: pxToDp(72),
        height: pxToDp(72),
        backgroundColor: "#f2f2f2",
        lineHeight: pxToDp(72),
        textAlign: "center",
        fontSize: pxToDp(40)
    },
    produectchoicestate: {
        width: pxToDp(750),
        height: pxToDp(100),
        position: "absolute",
        bottom: 0,
        left: 0,
        flexDirection: "row"
    },
    joinshopingproduect: {
        width: "50%",
        lineHeight: pxToDp(100),
        textAlign: "center",
        fontSize: pxToDp(30),
        color: "white",
        backgroundColor: "#ff826e"
    },
    purchaseproduect: {
        width: "100%",
        lineHeight: pxToDp(100),
        textAlign: "center",
        fontSize: pxToDp(30),
        color: "white",
        backgroundColor: "#FF7941",
    },
    // 客服
    customercolse: {
        width: pxToDp(20),
        height: pxToDp(20),
        marginLeft: pxToDp(295)
    },
    Customer_service: {
        width: "50%",
        borderRadius: pxToDp(20),
        paddingHorizontal: pxToDp(30),
        paddingVertical: pxToDp(30),
        backgroundColor: "#dedede",
        position: "absolute",
        bottom: "25%",
        left: "25%"
    },
    customercode: {
        width: pxToDp(315),
        height: pxToDp(315),
        marginTop: pxToDp(30),
    },
    codefontsize: {
        fontSize: pxToDp(27),
        marginTop: pxToDp(20)
    },
    shareModal: {
        position: "relative",
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    shareModalContainer: {
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: theme.colorWhite,
        borderTopLeftRadius: pxToDp(20),
        borderTopRightRadius: pxToDp(20),
    },
    shareModalContainerContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: pxToDp(40),
    },
    shareModalBtnsContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginRight: pxToDp(20)
    },
    shareModalBtns: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: pxToDp(8),
        backgroundColor: theme.color333,
        marginBottom: pxToDp(10),
        padding: pxToDp(20)
    },
    shareModalBtnsIcon: {
        width: pxToDp(60),
        height: pxToDp(60)
    },
    shareModalBtnsText: {
        fontSize: pxToDp(24),
        color: theme.color333
    },
    shareModalBtnCancel: {
        height: pxToDp(80),
        backgroundColor: theme.color999,
        borderRadius: 0
    },
    shareModalBtnCancelText: {
        fontSize: pxToDp(24),
        fontWeight: "500",
        color: theme.colorWhite
    }
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(SeckillDetails)
