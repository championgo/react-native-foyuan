import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, TextInput, Modal, DeviceEventEmitter, Alert, Platform, PermissionsAndroid, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import * as wechat from 'react-native-wechat-lib';
import { NavigationActions, pxToDp, theme, Storage } from '../utils';
import Swiper from 'react-native-swiper';
import RNFS from 'react-native-fs';
import CameraRoll from "@react-native-community/cameraroll";
import Touchable from '../components/Touchable';
import Toaste from 'react-native-tiny-toast';
import { Button, Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');
import Config from '../config';
import { Root, Toast } from 'native-base';

const apiDomain = Config[Config.dev].apiDomain;
const numArr = [0, 1, 2, 3, 4];
class CommodityDetail extends Component {
    static navigationOptions = {
        title: '商品详情',
    }
    constructor(props) {
        super(props);
        this.state = {
            tabActiveIndex: 0,
            // 规格选择弹出
            modalVisible: false,
            // 客服弹出
            tabIndex: 0,
            selecttype: [
                { name: "商品详情", tabActiveIndex: 0 },
                { name: "猜你喜欢", tabActiveIndex: 1 }
            ],
            inputtext: 1,
            // 价格
            price: "",
            // 商品名
            title: "",
            // 运费
            freight: '',
            // 评论数量
            comments_num: "",
            //评论展示的内容
            Commentcontent: [],
            //评论星星数量
            stars: 0,
            // 商品详情的顶部banner
            banner: [],
            // 猜我喜欢
            recommends: [],
            //商品详情介绍
            fulltext: [],
            // 店铺图标名称
            shop: [],
            // 选择规格
            properties: [],
            // 选择规格里面的商品切换
            tabcommodityindex: null,
            // 商品id
            productid: '',
            // 选择规格时商品的类型
            property: [],
            //购买商品的id
            product_sku_id: "",
            Imagecommodity: [],
            id: "",
            // 加载状态
            meauListLoad: true,
            // 组合优惠价格
            discounts: '',
            group: [],
            groupdata: [],
            // 用户信息
            Information: '',
            // 分销
            is_distribution: '',
            shareModalVisible: false, // share modal
            // 图片展示
            modalVisibledelete: false,
            Imagepic: '',
            picheight: '',
            is_presell: 1

        }
    }
    async componentDidMount() {
        this.initService();
        this.setState({
            Information: await Storage.get("user_info")
        })
    }
    componentDidUpdate() {
        const { navigation: { state: { params: { id } } } } = this.props;
        if (this.state.id != id) {
            this.initService();
        }
    }
    initService = () => {
        const { dispatch, navigation: { state: { params: { id } } } } = this.props;
        dispatch({
            type: 'commodityModel/commoditydetail',
            payload: {
                id
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        id: id,
                        freight: res.data.freight,
                        comments_num: res.data.comments_num,
                        clickcollect: res.data.collect,
                        banner: res.data.sku.product.images,
                        recommends: res.data.recommends,
                        fulltext: res.data.sku.product.product_content.fulltext,
                        shop: res.data.sku.product.shop,
                        properties: res.data.properties,
                        price: res.data.sku.price,
                        title: res.data.sku.product.title,
                        commodityicon: res.data.sku.thumb,
                        productid: res.data.sku.product_id,
                        is_distribution: res.data.sku.is_distribution
                    }, () => {
                        this.Comments();
                        this.Imagecommoeity();
                        this.getGroup()
                    })
                }
            }
        })
    }
    // 组合套餐
    getGroup = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/getGroup',
            payload: {
                id: this.state.id
            },
            callback: res => {
                if (res.error === 0) {
                    if (res.data == "") {
                        this.setState({
                            groupdata: res.data,
                            meauListLoad: false,
                        })
                    } else {
                        this.setState({
                            meauListLoad: false,
                            groupdata: res.data,
                            discounts: res.data.discounts,
                            group: res.data.group,
                        })
                    }
                }
            }
        })
    }

    // 评论
    Comments = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/productshowreview',
            payload: {
                product_id: this.state.productid,
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        Commentcontent: res.data
                    })
                }
            }
        })
    }
    // // 商品详情，猜你喜欢
    TabClick(item) {
        this.setState({
            tabActiveIndex: item.tabActiveIndex
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
    // 购物车
    Shopping = () => {
        DeviceEventEmitter.emit('buyAgain', true);
        this.props.dispatch(NavigationActions.navigate({ routeName: 'ShoppingCart' }))
    }
    // 规格，加入购物车,立即购买选择框
    Specificationscheched = () => {
        this.setState({
            modalVisible: true
        })
    }
    Specificationscheche = () => {
        this.setState({
            modalVisible: false
        })
    }
    // 商品选择
    Productchoicename = (idx, itam) => {
        this.setState({
            property: [{ property_id: itam.property_id, property_value: itam.property_value }]
        }, () => {
            const { dispatch } = this.props;
            dispatch({
                type: 'commodityModel/productselection',
                payload: {
                    product_id: this.state.productid,
                    property: this.state.property
                },
                callback: res => {
                    if (res.error === 0) {
                        this.setState({
                            commodityicon: res.data.sku.thumb,
                            price: res.data.sku.price,
                            product_sku_id: res.data.sku.id,
                            tabcommodityindex: idx
                        })
                    }
                }
            })
        })
    }
    // 立即购买
    Purchase = () => {
        if (this.state.product_sku_id == "") {
            Toast.show({
                text: "请选择商品规格",
                duration: 2000,
                textStyle: { textAlign: 'center', height: pxToDp(70), lineHeight: pxToDp(70) },
            })
        } else {
            this.setState({
                modalVisible: false
            }, () => {
                const { dispatch } = this.props;
                const { product_sku_id, inputtext } = this.state;
                const params = {
                    product_sku_id,
                    num: inputtext
                };
                dispatch(NavigationActions.navigate({ routeName: 'Settlement', params }));
            })
        }
    }
    //加入购物车
    Joinshopping = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/joinshopping',
            payload: {
                id: this.state.product_sku_id,
                quantity: this.state.inputtext
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        tabindex: 0,
                        modalVisible: false
                    }, () => {
                        Toaste.show('成功加入购物车', {
                            position: 0,
                            duration: 2000,
                        })
                    })
                } else {
                    Toast.show({
                        text: "请选择商品规格",
                        duration: 2000,
                        textStyle: { textAlign: 'center', height: pxToDp(70), lineHeight: pxToDp(70) },
                    })
                }
            }
        })
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
        this.myScrollView.scrollTo({ y: this.layout.y, animated: true });  //跳转到顶部
    }
    // 优惠组合
    Combination = () => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CombinationDiscount', params: this.state.productid }))
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
                <Image style={styles.Imagecommodity, { height: item.height }} resizeMode="contain" source={{ uri: item?.container }} key={`CommentImg_${index}`}></Image>
            )
        } else if (item.type == "text") {
            return (
                <Text key={`CommentImg_${index}`}>{item.container}</Text>
            )
        }
    }
    // 店铺页面a
    shophome = (a) => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: 'ShopHome', params: a }));
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
        const { title, commodityicon, id, Information } = this.state;
        const params = { id };
        if (Information && Information.distributor_status == 2) {
            params.parent_id = Information.id
        };
        this.shareModal(false);
        wechat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                wechat.shareWebpage({
                    title,
                    description: '匠心好物—千挑万选，只想给你最好的。',
                    thumbImageUrl: commodityicon,
                    webpageUrl: `${apiDomain}weixin/commodity-detail/${encodeURI(JSON.stringify(params))}?share=true`,
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
    // 图片展示
    Commoditypic = (itum) => {
        let Imageresult = [];
        Image.getSize(itum, (width, height) => {   //处理图片自适应的方法
            const myheight = Math.floor(theme.screenWidth * height / width);
            Imageresult.push({ "image": itum, picheight: myheight });
            this.setState({
                modalVisibledelete: true,
                Imagepic: Imageresult[0].image,
                picheight: Imageresult[0].picheight
            })
        });
    }
    // 全部评论
    AllEvaluate = (a) => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'AllEvaluate', params: a }));
    }
    render() {
        const { shareModalVisible, group } = this.state;

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
                                {
                                    this.state.banner.slice(0, 3).map((item, index) => (
                                        <View style={styles.slide} key={`banner_${index}`}>
                                            <Image style={styles.bannerimage} source={{ uri: Config.apicommodity + item.img }}></Image>
                                        </View>
                                    ))
                                }
                            </Swiper>
                        </View>
                        {/* 分销，商品名 */}
                        <View style={styles.Commoditysituation}>
                            <View style={{ flexDirection: "row" }}>
                                {
                                    this.state.Information.distributor_status == 2 && this.state.is_distribution == 1 ?
                                        <View style={{ marginRight: pxToDp(20) }}>
                                            <Text style={styles.distributionco}>分销</Text>
                                        </View>
                                        : null
                                }
                                {/* {
                                    this.state.is_presell == 1 ?
                                        <View style={{ marginRight: pxToDp(20) }}>
                                            <Text style={styles.distributioncon}>预售</Text>
                                        </View>
                                        :
                                        null
                                } */}
                            </View>
                            <View style={{ flexWrap: "wrap", flex: 1 }}>
                                <Text style={styles.commoditytit}>{this.state.title}</Text>
                            </View>
                        </View>
                        {/* 商品价格，分享，收藏 */}
                        <View style={styles.Commoditydetailing}>
                            <View style={styles.CommodityDetail}>
                                <View style={styles.commoditybox}>
                                    <Text style={styles.commodityprice}>{numeral(this.state.price).format('$0,0.00')}</Text>
                                    {/* {
                                        this.state.is_presell == 1 ?
                                            <Text style={styles.deliver_goods_time}>预计10.11日起发货</Text>
                                            :
                                            null
                                    } */}
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
                            <Touchable onPress={this.Specificationscheched}>
                                <View style={styles.allchoice}>
                                    <Text style={styles.chociechoice}>选择</Text>
                                    <Text style={styles.specificationscolor}>规格，颜色等</Text>
                                    <Touchable style={styles.arrowcon}>
                                        <Text style={styles.detailscon}></Text>
                                        <Image style={styles.arrow} source={require('../images/next.png')}></Image>
                                    </Touchable>
                                </View>
                            </Touchable>
                            <View style={styles.allchoice}>
                                <Text style={styles.chociechoice}>运费</Text>
                                <Text style={styles.specifications}>{this.state.freight}</Text>
                                <Touchable style={styles.arrowcon}>
                                    <Text style={styles.detailscon}></Text>
                                    <Text style={styles.arrow}></Text>
                                </Touchable>
                            </View>
                            {
                                this.state.groupdata != "" ?
                                    <View>
                                        <View style={styles.Combination_discount}>
                                            <Text style={styles.chociechoice}>优惠</Text>
                                            <Text style={styles.specifications}>共{this.state.group.length}组优惠组合，最高可省<Text style={styles.specificationszi}>{this.state.discounts}元</Text></Text>
                                            <Touchable style={styles.arrowcon} onPress={this.Combination}>
                                                <Text style={styles.detailscon}>详情</Text>
                                                <Image style={styles.arrow} source={require('../images/next.png')}></Image>
                                            </Touchable>
                                        </View>

                                        <View style={styles.goods_pic}>
                                            {
                                                group.map((item, Index) => (
                                                    <View style={{ flexDirection: 'row' }} key={`group_${Index}`}>
                                                        <View style={styles.goods_pictrue}>
                                                            <Image style={styles.goods_pictrue} source={{ uri: item.thumb }}></Image>
                                                        </View>
                                                        {
                                                            group.length == 1 || group.length - 1 == Index ?
                                                                null :
                                                                <Text style={styles.goods_plus}>+</Text>
                                                        }
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    </View>
                                    : null
                            }
                        </View>
                        {
                            this.state.comments_num >= 1 ?
                                <View style={{ width: "100%", height: pxToDp(10), backgroundColor: theme.baseBackgroundColor, marginTop: pxToDp(20) }}></View>
                                : null
                        }
                        {/* 评论 */}
                        {
                            this.state.comments_num >= 1 ?
                                <View style={styles.comment}>
                                    <View style={styles.commenttitle}>
                                        <Text style={styles.commentnumber}>评论（{this.state.comments_num}）</Text>
                                        <Touchable style={styles.jumpmorecomment} onPress={() => this.AllEvaluate(this.state.productid)}>
                                            <Text style={styles.morecomment}>全部</Text>
                                            <Image style={styles.commentarrow} source={require('../images/next.png')}></Image>
                                        </Touchable>
                                    </View>

                                    {
                                        this.state.Commentcontent.slice(0, 2).map((item, index) => (
                                            <View style={styles.commentcontent} key={`Commentcontent_${index}`}>
                                                <View style={styles.commentAvatar}>
                                                    <Image style={styles.headpic} source={{ uri: item.user?.head_img }}></Image>
                                                </View>
                                                <View style={styles.CommentDetailed}>
                                                    <View style={styles.commentdetailed}>
                                                        <Text style={styles.commentname}>{item.user.name}</Text>
                                                        <View style={styles.scoreImage}>
                                                            {
                                                                numArr.map((imageItem, index) => <Image style={styles.score} source={index >= item.rating ? require('../images/noscore.png') : require('../images/score.png')} key={`imageItem_${index}`}></Image>)
                                                            }
                                                        </View>
                                                    </View>
                                                    {
                                                        item.images.length >= 1 ?
                                                            <View style={styles.Commoditypic}>
                                                                {
                                                                    item.images.slice(0, 2).map((itum, idx) => (
                                                                        <Touchable style={styles.Commoditypicturn} onPress={() => this.Commoditypic(itum, idx)}>
                                                                            <Image style={styles.showpicturn} source={{ uri: itum }}></Image>
                                                                        </Touchable>
                                                                    ))
                                                                }
                                                            </View>
                                                            : null
                                                    }
                                                    <View style={styles.commenttime}>
                                                        <Text style={styles.commenttimefontsize}>{item.diff}</Text>
                                                    </View>
                                                    {item.content != null ? <Text style={styles.commentdetails}>{item.content}</Text> : null}

                                                </View>
                                            </View>
                                        ))
                                    }
                                </View>
                                : null
                        }
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
                                {
                                    this.state.selecttype.map((item, index) => (
                                        <Text style={styles.detailtitle} key={`selecttype_${index}`} onPress={() => this.TabClick(item)}>
                                            <Text>{item.name}</Text>
                                        </Text>
                                    ))
                                }
                            </View>
                            <View style={styles.Selectstate}>
                                <View style={styles.selectbox}>
                                    {
                                        this.state.tabActiveIndex == 0 ?
                                            <View style={styles.Selectunderline}></View>
                                            : null
                                    }
                                </View>
                                <View style={styles.selectbox}>
                                    {
                                        this.state.tabActiveIndex == 1 ?
                                            <View style={styles.Selectunderline}></View>
                                            : null
                                    }
                                </View>
                            </View>
                            <View style={styles.selectcontent}>
                                {
                                    this.state.tabActiveIndex == 0 ?
                                        <View style={styles.commodityintroduce}>
                                            {this.state.Imagecommodity.map((item, index) => this.CommentImg(item, index))}
                                        </View>
                                        : null
                                }
                                {
                                    this.state.tabActiveIndex == 1 ?
                                        <View style={styles.likecommdity}>
                                            {
                                                this.state.recommends.slice(0, 3).map((item, index) => (
                                                    <View style={styles.likeintroduce} key={`recommends_${index}`}>
                                                        <Touchable onPress={() => this.Likegoods(item)} >
                                                            <View>
                                                                <Image style={styles.commodityImage} source={{ uri: item.thumb }}></Image>
                                                            </View>
                                                            <Text numberOfLines={1} style={styles.commodityname}>{item.title}</Text>
                                                            <Text numberOfLines={1} style={styles.commodityslogan}>{item.name}</Text>
                                                            <Text style={styles.commodityprices}>{numeral(item.price).format('$0,0.00')}</Text>
                                                        </Touchable>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                        : null
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {/* 底部导航栏 */}
                <View style={styles.bottonmenu} >
                    <View style={styles.navcon}>
                        <View style={styles.navcontent}>
                            <Touchable onPress={this.Customer}>
                                <View style={styles.navcustomerimage}>
                                    <Text >
                                        <Image style={styles.navcustomericon} source={require('../images/customerservice.png')}></Image>
                                    </Text>
                                </View>
                                <View style={styles.navcontenttitlebox}>
                                    <Text style={styles.navcontenttitle}>客服</Text>
                                </View>
                            </Touchable>
                        </View>


                        <View style={styles.navshopping}>
                            <Touchable onPress={this.Shopping}>
                                <View style={styles.navcustomerimage}>
                                    <Text>
                                        <Image style={styles.navcustomericon} source={require('../images/shoppingcar.png')}></Image>
                                    </Text>
                                </View>
                                <View style={styles.navcontenttitlebox}>
                                    <Text style={styles.navcontenttitle}>购物车</Text>
                                </View>
                            </Touchable>
                        </View>

                        <View style={styles.navjoinshopping}>
                            <Touchable onPress={this.Specificationscheched}>
                                <View style={styles.navcustomerimage}>
                                    <Text>
                                        <Image style={styles.navcustomericon} source={require('../images/joinshoppingcar.png')}></Image>
                                    </Text>
                                </View>
                                <View style={styles.navcontenttitlebox}>
                                    <Text style={styles.navcontenttitle} >加入购物车</Text>
                                </View>
                            </Touchable>
                        </View>
                    </View>
                    <Text style={styles.purchase} onPress={this.Specificationscheched}>立即购买</Text>
                </View>
                {/* 选择规格，立即购买，加入购买 */}
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
                                        <Image style={styles.commodityicon} source={{ uri: this.state.commodityicon }}></Image>
                                    </View>
                                    <View style={styles.commoditypicon}>
                                        <View style={styles.signout}>
                                            <Touchable onPress={this.Specificationscheche}>
                                                <Image style={styles.outbutton} source={require('../images/closes.png')}></Image>
                                            </Touchable>
                                        </View>
                                        <View style={styles.commoditypiccontent}>
                                            <Text style={styles.commoditypiccontenttitle}>{this.state.title}</Text>
                                            <Text style={styles.commoditypicconprice}>{numeral(this.state.price).format('$0,0.00')}</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* 规格 */}
                                {
                                    Object.keys(this.state.properties).map((item, index) => (
                                        <View style={styles.Specifications} key={`properties_${index}`}>
                                            <View style={{ marginTop: pxToDp(15) }}>
                                                <Text style={styles.specificationstitle}>{item}</Text>
                                            </View>
                                            <View style={styles.specificationsstyle}>
                                                {
                                                    this.state.properties[item].map((itam, idx) => (
                                                        <View key={`properties_${idx}`}>
                                                            <Text style={styles[this.state.tabcommodityindex == idx ? "producttypenamech" : "producttypename"]} onPress={() => this.Productchoicename(idx, itam)}>{itam.property_value}</Text>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                    ))
                                }
                                {/* 数量 */}
                                <View style={styles.productnumber}>
                                    <Text style={styles.productnumbertitle}>数量</Text>
                                    <Text style={styles.numberminussign} onPress={this.decrease.bind(this)}>-</Text>
                                    <TextInput value={String(this.state.inputtext)} style={{ height: 40, width: 40, fontSize: pxToDp(30), textAlign: "center" }} onChangeText={(inputtext) => this.setState({ inputtext: Number(inputtext) == "" ? '' : Number(inputtext) })} />
                                    <Text style={styles.numberminussign} onPress={this.increase.bind(this)}>+</Text>
                                </View>
                                <Root>
                                    <View style={styles.produectchoicestate}>
                                        <Text style={styles.joinshopingproduect} onPress={this.Joinshopping}>加入购物车</Text>
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
                {/* 图片展示 */}
                <Modal
                    animationType={"fade "}
                    transparent={true}
                    visible={this.state.modalVisibledelete}
                    onRequestClose={() => this.setState({ modalVisibledelete: false })}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisibledelete: false })}>
                            <View style={styles.commoditynumber}>
                                <View style={styles.commoditytpic}>
                                    <Image style={{ width: '100%', height: this.state.picheight }} source={{ uri: this.state.Imagepic }}></Image>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
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
    // 分销，商品名
    Commoditysituation: {
        marginHorizontal: pxToDp(40),
        paddingVertical: pxToDp(20),
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    distributionco: {
        color: "#FF8400",
        backgroundColor: "#FFE7BA",
        fontSize: pxToDp(28),
        paddingHorizontal: pxToDp(20),
        borderRadius: pxToDp(10),

    },
    distributioncon: {
        color: "#F5222D",
        backgroundColor: "#FFCCC7",
        fontSize: pxToDp(28),
        paddingHorizontal: pxToDp(20),
        borderRadius: pxToDp(10),
        marginRight: pxToDp(20)
    },
    commoditytit: {
        width: '100%',
        fontSize: pxToDp(40),
    },
    // 商品价格，分享，收藏
    Commoditydetailing: {
        marginTop: pxToDp(10),
        paddingHorizontal: pxToDp(40),
        height: pxToDp(70),
    },
    CommodityDetail: {
        justifyContent: "space-between",
        flexDirection: "row",
    },
    commoditybox: {
        height: pxToDp(70),
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    commodityprice: {
        fontSize: pxToDp(42),
        color: "#66bfb8",
    },
    deliver_goods_time: {
        fontSize: pxToDp(22),
        color: "#F5222D",
        marginLeft: pxToDp(20),
        marginBottom: pxToDp(8)
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
        justifyContent: "space-between",
        flexDirection: "row"
    },
    chociechoice: {
        width: pxToDp(100),
        fontSize: pxToDp(30),
        lineHeight: pxToDp(40),
    },
    specificationscolor: {
        width: pxToDp(460),
        fontSize: pxToDp(30),
        lineHeight: pxToDp(40),
        color: "rgb(163, 168, 176)",
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

    // 组合优惠
    Combination_discount: {
        paddingBottom: pxToDp(15),
        justifyContent: "space-between",
        flexDirection: "row"
    },
    goods_pic: {
        height: pxToDp(120),
        marginLeft: pxToDp(110),
        flexDirection: 'row',
    },
    goods_pictrue: {
        width: pxToDp(120),
        height: pxToDp(120),
        borderRadius: pxToDp(8),
    },
    goodsImage: {
        width: pxToDp(120),
        height: pxToDp(120)
    },
    goods_plus: {
        paddingHorizontal: pxToDp(30),
        lineHeight: pxToDp(120),
        fontSize: pxToDp(36),
        color: '#A3A8B0'
    },
    // 评论
    comment: {
        paddingVertical: pxToDp(20),
        paddingHorizontal: pxToDp(40)
    },
    commenttitle: {
        justifyContent: "space-between",
        flexDirection: 'row'
    },
    commentnumber: {
        fontSize: pxToDp(30)
    },
    jumpmorecomment: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    morecomment: {
        fontSize: pxToDp(30),
        paddingRight: pxToDp(10)
    },
    commentarrow: {
        width: pxToDp(20),
        height: pxToDp(20),
    },
    commentcontent: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: pxToDp(60)
    },
    commentAvatar: {
        width: pxToDp(80),
        height: pxToDp(80),
    },
    headpic: {
        width: pxToDp(80),
        height: pxToDp(80),
        borderRadius: pxToDp(100),
    },
    CommentDetailed: {
        width: pxToDp(550),
    },
    Commoditypic: {
        width: pxToDp(550),
        justifyContent: "space-between",
        flexDirection: "row"
    },
    Commoditypicturn: {
        width: pxToDp(270),
        height: pxToDp(270),
        marginTop: pxToDp(15),
    },
    showpicturn: {
        width: "100%",
        height: "100%"
    },
    commentdetailed: {
        alignItems: "center",
        flexDirection: "row",
    },
    commentname: {
        fontSize: pxToDp(30),
        marginRight: pxToDp(20)
    },
    scoreImage: {
        flexDirection: "row",
    },
    score: {
        width: pxToDp(40),
        height: pxToDp(40),
    },
    commenttime: {
        // flexWrap: "wrap",
        paddingVertical: pxToDp(15)
    },
    commenttimefontsize: {
        fontSize: pxToDp(24),
        color: "#a3a8b0",
    },
    commentdetails: {
        fontSize: pxToDp(30)
    },
    // 店铺主页
    shoppage: {
        marginHorizontal: pxToDp(40),
        marginVertical: pxToDp(50),
    },
    shopcontent: {
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
        flexDirection: "row"
    },
    detailtitle: {
        width: "50%",
        height: pxToDp(70),
        textAlign: "center",
        lineHeight: pxToDp(70),
        fontSize: pxToDp(28),
        color: "#2d2d2d",
        alignItems: "center"
    },
    Selectstate: {
        width: "100%",
        flexDirection: "row"
    },
    selectbox: {
        width: "50%",
        height: pxToDp(4),
        alignItems: "center"
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
    commodityintroduce: {
        width: "100%",
    },
    Imagecommodity: {
        width: "100%",
    },
    likecommdity: {
        width: "100%",
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
        flexDirection: "row"
    },
    navcon: {
        width: "50%",
        height: pxToDp(100),
        flexDirection: 'row'
    },
    purchase: {
        width: "50%",
        lineHeight: pxToDp(100),
        fontSize: pxToDp(30),
        color: "white",
        textAlign: "center",
        backgroundColor: "#66bfb8"
    },
    navcontent: {
        width: "26%",
        height: pxToDp(68),
        marginTop: pxToDp(16)
    },
    navshopping: {
        width: "30%",
        height: pxToDp(68),
        marginTop: pxToDp(16)
    },
    navjoinshopping: {
        width: "44%",
        height: pxToDp(68),
        marginTop: pxToDp(16)
    },
    navcustomerimage: {
        width: "100%",
        height: pxToDp(34),
        alignItems: "center"
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
        position: "relative",
        top: 0,
        left: 0
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
        flexWrap: "wrap",
        position: "relative"
    },
    commoditypiccontenttitle: {
        fontSize: pxToDp(30)
    },
    commoditypicconprice: {
        position: "absolute",
        left: 0,
        bottom: 0,
        fontSize: pxToDp(28)
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
        color: "black",
    },
    producttypenamech: {
        fontSize: pxToDp(24),
        paddingHorizontal: pxToDp(20),
        paddingVertical: pxToDp(15),
        backgroundColor: "#66bfb8",
        marginRight: pxToDp(20),
        marginTop: pxToDp(20),
        borderRadius: pxToDp(10),
        color: "white",
    },

    productnumber: {
        marginTop: pxToDp(50),
        paddingHorizontal: pxToDp(40),
        height: pxToDp(90),
        display: "flex",
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: pxToDp(150)
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
        fontSize: pxToDp(48)
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
        width: "50%",
        lineHeight: pxToDp(100),
        textAlign: "center",
        fontSize: pxToDp(30),
        color: "white",
        backgroundColor: "#66bfb8",
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
    },
    commoditynumber: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commoditytpic: {
        width: "100%",
    }
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(CommodityDetail)
