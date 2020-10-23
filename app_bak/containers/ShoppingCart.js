import React, { Component } from 'react';
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, Modal, TouchableWithoutFeedback, TextInput, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, pxToDp, theme, Storage } from '../utils';
import Touchable from '../components/Touchable';
import Toast from 'react-native-tiny-toast'
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');

class ShoppingCart extends Component {
    static navigationOptions = {
        title: '购物车',
        tabBarIcon: ({ focused, tintColor }) => {
            return (
                <Image
                    style={[styles.icon, { tintColor }]}
                    source={require('../images/shopping_cart.png')}
                />
            )
        },
    }
    constructor(props) {
        super(props);
        this.state = {
            //购物车商品推荐
            Recommendshow: [],
            // 编辑状态
            editstate: 0,
            // 商品数量
            inputtext: '',
            // 失效商品
            invalid: [],
            // 我的购物车里面的商品
            products: [],
            // 已选中数量
            count: "",
            counttw: "",
            // 合计价格
            total: '',
            // 购物车选择规格
            title: "",
            thumb: "",
            price: "",
            skuname: '',
            // 商品id
            product_id: [],
            Properties: [],
            // 选择规格里面的商品切换
            tabcommodityindex: null,
            id: '',
            // 修改规格
            new_sku_id: '',
            // 遮罩层
            modalVisible: false,
            // 数量选择
            modalVisiblenumb: false,
            // 数量
            inputtexter: "",
            commodityid: '',
            // 清空下架商品
            modalVisibleempty: false,
            //删除商品
            modalVisibledelete: false,
            // 加载状态
            meauListLoad: true,
            skuvalue: '',
            // 选择规格的数量
            Propertieslength: "",
            NewArr: '',
            // 推荐记录
            Recommendation: [],
            is_presell: 0
        };
    }

    async componentDidMount() {
        this.setState({
            Recommendation: await Storage.get('search'),
        }, () => {
            this.Recommend();
            this.Shoppinglist();
        });

        // 广播事件 订单再次购买刷新数据
        this.EMIT = DeviceEventEmitter.addListener('buyAgain', res => {
            if (res) {
                this.setState({
                    editstate: 0
                }, () => {
                    this.Shoppinglist();
                })
            }
        });
    }

    componentWillUnmount() {
        // 卸载接受广播
        this.EMIT.remove();
    }

    // 为你推荐
    Recommend = () => {
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
                        Recommendshow: res.data,
                    })
                }
            }
        })
    }
    // 购物车列表
    Shoppinglist = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/shoppinglist',
            payload: {},
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        meauListLoad: false,
                        invalid: res.data.invalid,
                        products: res.data.products,
                        total: res.data.total.total,
                    }, () => {
                        this.Protucce();
                    })
                }
            }
        })
    }
    // 循环数据
    Protucce = () => {
        const Check = [];
        const Checklength = [];
        const newArr = []
        this.state.products.map((item) => {
            item.products.map((itam) => {
                Checklength.push(itam)
                if (itam.is_check == 1) {
                    Check.push(itam)
                    newArr.push(itam.id)
                }
            })
        })
        this.setState({
            count: Check.length,
            counttw: Checklength.length,
            NewArr: newArr
        })
    }
    Recommendjump(item) {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }))
    }
    // 编辑状态
    Editstate = () => {
        if (this.state.editstate == 0) {
            this.setState({
                editstate: 1
            })
        } else {
            this.setState({
                editstate: 0
            })
        }
    }
    Jumpshop = (itam) => {
        const { dispatch } = this.props;
        dispatch(NavigationActions.navigate({ routeName: 'ShopHome', params: itam.shop }));
    }
    // 商品数量的减
    decrease(item) {
        if (item.quantity > 1) {
            const { dispatch } = this.props;
            dispatch({
                type: 'commodityModel/numberchange',
                payload: {
                    id: item.id,
                    quantity: item.quantity - 1
                },
                callback: res => {
                    if (res.error === 0) {
                        this.Shoppinglist()
                    }
                }
            })
        }
    }
    // 商品数量的加
    increase(item) {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/numberchange',
            payload: {
                id: item.id,
                quantity: item.quantity + 1
            },
            callback: res => {
                if (res.error === 0) {
                    this.Shoppinglist()
                }
            }
        })
    }
    // 全选
    Selection = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/batch',
            payload: {
                is_check: this.state.counttw == this.state.count ? 0 : 1
            },
            callback: res => {
                if (res.error === 0) {
                    this.Shoppinglist()
                }
            }
        })
    }
    // 选中按钮
    Commoditystatus = (item) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/numberchange',
            payload: {
                id: item.id,
                is_check: item.is_check == 0 ? 1 : 0
            },
            callback: res => {
                if (res.error === 0) {
                    this.Shoppinglist()
                }
            }
        })
    }
    // 遮罩层商品规格选择
    Maksk = (item) => {
        this.setState({
            id: item.id,
            product_id: item.product_id,
        }, () => {
            Object.keys(item.product_sku.sku_properties).map((itm) => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'commodityModel/productselection',
                    payload: {
                        product_id: item.product_id,
                        property: [{ property_id: item.product_sku.sku_properties[itm].property_id, property_value: item.product_sku.name }]
                    },
                    callback: res => {
                        if (res.error === 0) {
                            this.setState({
                                Properties: res.data.properties,
                                thumb: res.data.sku?.thumb || '',
                                price: res.data.sku.price,
                                title: res.data.sku.product.title,
                                skuname: res.data.sku.name,
                                modalVisible: true
                            }, () => {
                                Object.keys(this.state.Properties).map((item) => {
                                    this.setState({
                                        Propertieslength: this.state.Properties[item].length
                                    })
                                })
                            })
                        }
                    }
                })
            })
        })
    }
    //商品数量选择弹出窗
    Numberchoice = (item) => {
        this.setState({
            modalVisiblenumb: true,
            inputtexter: item.quantity,
            commodityid: item.id
        })
    }
    Nmubereduce = () => {
        if (this.state.inputtexter > 1) {
            this.setState({
                inputtexter: this.state.inputtexter - 1
            })
        }
    }
    Nmuberplus = () => {
        this.setState({
            inputtexter: this.state.inputtexter + 1
        })
    }

    // 选择规格样式改变
    Productchoicename = (item) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/productselection',
            payload: {
                product_id: this.state.product_id,
                property: [{ property_id: item.property_id, property_value: item.property_value }]
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        skuname: res.data.sku.name,
                        thumb: res.data.sku.thumb,
                        price: res.data.sku.price,
                        new_sku_id: res.data.sku.id
                    })
                }
            }
        })
    }
    // 选择规格确认
    Submit = () => {
        if (this.state.Propertieslength > 1) {
            const { dispatch } = this.props;
            dispatch({
                type: 'commodityModel/numberchange',
                payload: {
                    id: this.state.id,
                    new_sku_id: this.state.new_sku_id
                },
                callback: res => {
                    if (res.error === 0) {
                        this.setState({
                            modalVisible: false,
                        }, () => {
                            this.Shoppinglist()
                        })
                    }
                }
            })
        } else {
            this.setState({
                modalVisible: false,
            })
        }
    }
    // 商品数量选择取消
    Cancel = () => {
        this.setState({
            modalVisiblenumb: false
        })
    }
    // 商品数量选择确认
    Confirm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/numberchange',
            payload: {
                id: this.state.commodityid,
                quantity: this.state.inputtexter
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        modalVisiblenumb: false
                    }, () => {
                        this.Shoppinglist()
                    })
                }
            }
        })
    }
    // 商品下架清空弹出按钮
    Empty = () => {
        this.setState({
            modalVisibleempty: true
        })
    }
    // 商品下架清空弹出取消按钮
    Emptycancel = () => {
        this.setState({
            modalVisibleempty: false
        })
    }
    // 商品下架清空弹出确认清空
    Emptyconfirm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/empty_cart',
            payload: {},
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        modalVisibleempty: false
                    }, () => {
                        this.Shoppinglist()
                    })
                }
            }
        })
    }
    // 商品删除弹出框
    Deleteword = () => {
        if (this.state.count == 0) {
            Toast.show('还没有选择宝贝哦', {
                position: 0,
                duration: 2000,
            });
        } else {
            this.setState({
                modalVisibledelete: true
            })
        }
    }
    // 商品删除关闭删除按钮
    Deletecancel = () => {
        this.setState({
            modalVisibledelete: false
        })
    }
    // 删除购物车商品
    Deleteconfirm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/deleteing',
            payload: {
                ids: this.state.NewArr
            },
            callback: res => {
                if (res.error === 0) {
                    this.setState({
                        modalVisibledelete: false
                    }, () => {
                        this.Shoppinglist();
                        Toast.show('删除成功', {
                            position: 0,
                            duration: 2000,
                        });
                    })
                }
            }
        })
    }
    // 立即购买
    Purchase = () => {
        if (this.state.count == 0) {
            Toast.show('还没有选择宝贝哦', {
                position: 0,
                duration: 2000,
            });
        } else {
            const { dispatch } = this.props;
            dispatch(NavigationActions.navigate({ routeName: 'Settlement' }));
        }
    }
    Commoditydetails = (item) => {
        item.id = item.product_sku_id
        this.props.dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }))
    }
    render() {
        if (this.state.meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                {
                    this.state.products.length == 0 ?
                        <View style={styles.noshopping}>
                            <View style={styles.shoppinghead}>
                                <Text style={styles.shoppingheadtitle}>购物车</Text>
                            </View>
                            <ScrollView>
                                <View style={styles.shoppingicon}>
                                    <Image style={styles.shoppingiconshow} source={require('../images/lustration_cart.png')}></Image>
                                    <Text style={styles.emptyshoppingcart}>购物车还是空的哦，去添加点什么</Text>
                                </View>
                                <View style={styles.yourecommend}>
                                    <Text style={styles.yourecommendtitle}>为你推荐</Text>
                                    <View style={styles.recommendshow}>
                                        {
                                            this.state.Recommendshow.map((itum, idx) => (
                                                <View key={`Recommendshow_${idx}`}>
                                                    <Touchable onPress={() => this.Recommendjump(itum, idx)}>
                                                        <View style={styles.recommendshowcontent}>
                                                            <Image style={styles.recommendshowpic} source={{ uri: itum.thumb }}></Image>
                                                            {
                                                                itum.product != null ?
                                                                    <Touchable style={styles.commoditydetails}>
                                                                        <Text style={styles.recommendshowpictitle} numberOfLines={1}>{itum.product.title}</Text>
                                                                        <Text style={styles.recommendshowintroduce} numberOfLines={1}>{itum.product.keywords}</Text>
                                                                        <Text style={styles.recommendshowintroduceprice}>{numeral(itum.price).format('$0,0.00')}</Text>
                                                                    </Touchable>
                                                                    : null
                                                            }
                                                        </View>
                                                    </Touchable>
                                                </View>
                                            ))}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        :
                        <View style={styles.yesmyshopping}>
                            <View style={styles.myshoppinghead}>
                                <View style={styles.myshoppingheadtitle}>
                                    <Text style={styles.shoppingheadtitle}>购物车</Text>
                                </View>
                                <View style={styles.myshoppingheadtitlestate}>
                                    <Text style={styles.myshoppingheadtitlestatetit} onPress={() => this.Editstate()}>{this.state.editstate == 0 ? "编辑" : "完成"}</Text>
                                </View>
                            </View>
                            <ScrollView>
                                <View style={styles.myshoppingcontainer}>
                                    {
                                        this.state.products.map((itam, idx) => (
                                            <View key={`products_${idx}`}>
                                                <Touchable onPress={() => this.Jumpshop(itam)}>
                                                    <View style={styles.myshoppingcontainershop}>
                                                        <Text style={styles.myshoppingcontainershoptit}>{itam.shop.title}</Text>
                                                        <Image style={styles.shopjumparrow} source={require('../images/shop_next.png')}></Image>
                                                    </View>
                                                </Touchable>
                                                <View>
                                                    {
                                                        itam.products.map((item, index) => (
                                                            <View style={styles.myshoppingorder} key={`products_${index}`}>
                                                                <Touchable style={styles.ordercontainer} onPress={() => this.Commoditystatus(item)}>
                                                                    {
                                                                        item.is_check == 0 ?
                                                                            <Image style={styles.selectstats} source={require('../images/noselect.png')}></Image>
                                                                            :
                                                                            <Image style={styles.selectstats} source={require('../images/select.png')}></Image>
                                                                    }
                                                                </Touchable>
                                                                <View style={styles.productcontainer}>
                                                                    <Touchable style={styles.orderpic} onPress={() => this.Commoditydetails(item)}>
                                                                        <Image style={styles.orderpictrue} source={{ uri: item.product_sku.thumb }}></Image>
                                                                    </Touchable>
                                                                    <View style={styles.productcontainertitle}>
                                                                        <View style={styles.productcontainertitleco}>
                                                                            {
                                                                                this.state.is_presell == 1 ?
                                                                                    <Text style={styles.pre_sale}>预售</Text>
                                                                                    :
                                                                                    null
                                                                            }
                                                                            <Text style={styles[this.state.is_presell == 1 ? "productcontainertitles" : "noproductcontainertitles"]} numberOfLines={1}>{item.product.title}</Text>
                                                                        </View>
                                                                        <Touchable style={styles.producttype} onPress={() => this.Maksk(item)}>
                                                                            <Text style={styles.producttypename} numberOfLines={1}>{item.product_sku.name}</Text>
                                                                            <Image style={styles.producttypenamemore} source={require('../images/next_arrow.png')}></Image>
                                                                        </Touchable>
                                                                        <Text style={styles.producttypenameprice}>{numeral(item.product_sku.price).format('$0,0.00')}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.producttypenumber}>
                                                                    <Touchable style={styles.producttypenumberreduce} onPress={this.decrease.bind(this, item)}>
                                                                        <Text style={styles.fontSizestyle}>—</Text>
                                                                    </Touchable>
                                                                    <Touchable style={styles.producttypenumbershow} onPress={() => this.Numberchoice(item)}>
                                                                        <Text style={styles.producttypenumbershowfont}>{String(item.quantity)}</Text>
                                                                    </Touchable>
                                                                    <Touchable style={styles.producttypenumberreduce} onPress={this.increase.bind(this, item)}>
                                                                        <Text style={styles.fontSizestyle}>+</Text>
                                                                    </Touchable>
                                                                </View>
                                                            </View>
                                                        ))
                                                    }
                                                </View>
                                            </View>
                                        ))
                                    }
                                </View>
                                {/* 下架商品 */}
                                {
                                    this.state.invalid != "" ?
                                        <View style={styles.invalid}>
                                            <View style={styles.invalidcontent}>
                                                <View style={styles.invalidcontenttitle}>
                                                    <Text style={styles.invalidcontenttitlename}>失效商品</Text>
                                                    <Text style={styles.invalidcontentempty} onPress={this.Empty}>清空</Text>
                                                </View>
                                                {
                                                    this.state.invalid.map((itam, index) => (
                                                        <View style={styles.invalidproduct} key={`invalid_${index}`}>
                                                            <Text style={styles.invalidproductstats}>{itam.reason}</Text>
                                                            <Image style={styles.invalidproductstatspic} source={{ uri: itam.product_sku.thumb }}></Image>
                                                            <View style={styles.productcontainertitleinvalid}>
                                                                <Text style={styles.productcontainertitlecon}>{itam.product.title}</Text>
                                                                <Text style={styles.producttypenameinvalid} numberOfLines={1} >{itam.product_sku.name}</Text>
                                                                <Text style={styles.producttypenameprice}>{numeral(itam.product_sku.price).format('$0,0.00')}</Text>
                                                            </View>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                        : null
                                }
                            </ScrollView>
                            {/* 底部内容 */}
                            <View style={styles.bottomcontent}>
                                <View style={styles.Selection}>
                                    <Touchable style={styles.Selectionall} onPress={this.Selection}>
                                        {
                                            this.state.counttw == this.state.count ?
                                                <View style={styles.Selectionan}>
                                                    <Image style={styles.Selectionbuuton} source={require('../images/select.png')}></Image>
                                                    <Text style={styles.Selectionbuutonword}>全选({this.state.count})</Text>
                                                </View>
                                                :
                                                <View style={styles.Selectionan}>
                                                    <Image style={styles.Selectionbuuton} source={require('../images/noselect.png')}></Image>
                                                    <Text style={styles.Selectionbuutonword}>已选({this.state.count})</Text>

                                                </View>
                                        }
                                    </Touchable>
                                </View>
                                {
                                    this.state.editstate == 0 ?
                                        <View style={styles.Selectionstats}>
                                            <View style={styles.totalprice}>
                                                <Text style={styles.total}>合计：</Text>
                                                <Text style={styles.totalpricepri}>{this.state.total}元</Text>
                                            </View>
                                            <View style={styles.buynow}>
                                                <Touchable onPress={this.Purchase}>
                                                    <Text style={styles.buynowbuttom}>立即购买</Text>
                                                </Touchable>
                                            </View>
                                        </View>
                                        :
                                        <View style={styles.delete}>
                                            <Text style={styles.deleteword} onPress={this.Deleteword}>删除</Text>
                                        </View>
                                }
                            </View>
                        </View>

                }
                {/* 购物车里面选择规格 */}
                <Modal
                    animationType={"fade "}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
                            <View style={styles.Specificationschoice}>
                                <Touchable style={styles.specificationschoice}>
                                    <View style={styles.specification}>
                                        {/* 规格图片文字 */}
                                        <View style={styles.productinformation}>
                                            <Image style={styles.productinformationpic} source={{ uri: this.state.thumb }}></Image>
                                            <View style={styles.productcontainering}>
                                                <Text style={styles.productname}>{this.state.title}</Text>
                                                <Text style={styles.productprice}>{numeral(this.state.price).format('$0,0.00')}</Text>
                                            </View>
                                        </View>
                                        {/* 规格选择 */}
                                        {
                                            Object.keys(this.state.Properties).map((itam, Index) => (
                                                <View style={styles.Productspecifications} key={`Properties_${Index}`}>
                                                    <View>
                                                        <Text style={styles.guige}>{itam}</Text>
                                                    </View>
                                                    <View style={styles.specificationscontent}>
                                                        {
                                                            this.state.Properties[itam].map((item, index) => (
                                                                <View key={`item_${index}`}>
                                                                    <Touchable onPress={() => this.Productchoicename(item, index)}>
                                                                        <Text style={styles[item.property_value == this.state.skuname ? "noguigetitle" : "guigetitle"]}>{item.property_value}</Text>
                                                                    </Touchable>
                                                                </View>
                                                            ))
                                                        }
                                                    </View>
                                                </View>
                                            ))
                                        }
                                    </View>
                                </Touchable>
                                {/* 确定 */}
                                <View style={styles.Submit}>
                                    <Text style={styles.Submittitle} onPress={this.Submit}>确认</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </Modal>

                {/* 购物车数量选择 */}
                <Modal
                    animationType={"fade "}
                    transparent={true}
                    visible={this.state.modalVisiblenumb}
                    onRequestClose={() => this.setState({ modalVisiblenumb: false })}>
                    <View style={styles.commoditynumber}>
                        <View style={styles.numberbox}>
                            <View style={styles.numberboxcon}>
                                <Text style={styles.numberboxtitle}>修改购买数量</Text>
                                <View style={styles.numberboxnum}>
                                    <Touchable style={styles.numberreduce} onPress={this.Nmubereduce}>
                                        <Text style={styles.numbercontetn}>—</Text>
                                    </Touchable>
                                    <TextInput value={String(this.state.inputtexter)} style={styles.inputcontent} onChangeText={(inputtexter) => this.setState({ inputtexter: Number(inputtexter) == "" ? '' : Number(inputtexter) })} />
                                    <Touchable style={styles.numberplus} onPress={this.Nmuberplus}>
                                        <Text style={styles.numbercontetn}>+</Text>
                                    </Touchable>
                                </View>
                                <View style={styles.subbutton}>
                                    <Text style={styles.cancel} onPress={this.Cancel}>取消</Text>
                                    <Text style={styles.confirm} onPress={this.Confirm}>确认</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* 清空下架商品 */}
                <Modal
                    animationType={"fade "}
                    transparent={true}
                    visible={this.state.modalVisibleempty}
                    onRequestClose={() => this.setState({ modalVisibleempty: false })}>
                    <View style={styles.commoditynumber}>
                        <Touchable style={styles.empatycommodity}>
                            <View style={styles.empatycommoditytitle}>
                                <Text style={styles.empatycommoditytitlecon}>确认清空失效宝贝？</Text>
                            </View>
                            <View style={styles.empatycommoditybuuton}>
                                <Text style={styles.emptycancel} onPress={this.Emptycancel}>取消</Text>
                                <Text style={styles.emptyconfirm} onPress={this.Emptyconfirm}>确认</Text>
                            </View>
                        </Touchable>
                    </View>
                </Modal>

                {/* 商品删除弹窗 */}
                <Modal
                    animationType={"fade "}
                    transparent={true}
                    visible={this.state.modalVisibledelete}
                    onRequestClose={() => this.setState({ modalVisibledelete: false })}>
                    <View style={styles.commoditynumber}>
                        <Touchable style={styles.empatycommodity}>
                            <View style={styles.empatycommoditytitle}>
                                <Text style={styles.empatycommoditytitlecon}>{this.state.count == 1 ? "确认要删除该商品吗？" : "确认要删除这" + this.state.count + "件商品吗？"}</Text>
                            </View>
                            <View style={styles.empatycommoditybuuton}>
                                <Text style={styles.emptycancel} onPress={this.Deletecancel}>我再想想</Text>
                                <Text style={styles.emptyconfirm} onPress={this.Deleteconfirm}>确认</Text>
                            </View>
                        </Touchable>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.baseBackgroundColor,
        position: "relative",
    },
    icon: {
        width: pxToDp(40),
        height: pxToDp(40),
    },
    //购物车无商品状态
    noshopping: {
        width: '100%',
        height: "100%",
    },
    shoppinghead: {
        width: "100%",
        height: pxToDp(88),
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: 'white',
        zIndex: 99
    },
    shoppingheadtitle: {
        textAlign: "center",
        lineHeight: pxToDp(88),
        fontSize: pxToDp(36),
        color: "#2d2d2d"
    },
    shoppingicon: {
        display: 'flex',
        alignItems: "center",
        marginTop: pxToDp(88),
        backgroundColor: "white"
    },
    shoppingiconshow: {
        marginTop: pxToDp(50),
        marginBottom: pxToDp(30),
        width: pxToDp(340),
        height: pxToDp(154)
    },
    emptyshoppingcart: {
        color: '#a3a8b0',
        fontSize: pxToDp(24),
        paddingBottom: pxToDp(40)
    },
    // 为你推荐
    yourecommend: {
        marginTop: pxToDp(10),
        paddingHorizontal: pxToDp(40),
        paddingBottom: pxToDp(40),
        backgroundColor: "white"
    },
    yourecommendtitle: {
        paddingVertical: pxToDp(40),
        fontSize: pxToDp(36),
        color: '#2d2d2d',
        textAlign: "center"
    },
    recommendshow: {
        display: 'flex',
        justifyContent: "space-between",
        flexWrap: 'wrap',
        flexDirection: "row"
    },
    recommendshowcontent: {
        width: pxToDp(320),
        marginTop: pxToDp(20),
        borderWidth: pxToDp(1),
        borderColor: "black",
        borderStyle: "solid",
    },
    recommendshowpic: {
        width: "100%",
        paddingTop: '100%'
    },
    commoditydetails: {
        paddingVertical: pxToDp(15),
        paddingHorizontal: pxToDp(12),
    },
    recommendshowpictitle: {
        fontSize: pxToDp(30),
        paddingTop: pxToDp(10),
        color: '#2d2d2d'
    },
    recommendshowintroduce: {
        fontSize: pxToDp(24),
        color: "#a3a8b0",
        paddingTop: pxToDp(10),
    },
    recommendshowintroduceprice: {
        fontSize: pxToDp(30),
        color: '#66bfb8',
        paddingTop: pxToDp(10),
    },
    // 购物车有商品状态
    yesmyshopping: {
        width: '100%',
        height: "100%",
    },
    myshoppinghead: {
        width: "100%",
        height: pxToDp(88),
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: 'white',
        zIndex: 99,
        display: "flex",
        alignItems: "center",
    },
    myshoppingheadtitle: {
        width: pxToDp(200),
        height: pxToDp(88),
    },
    myshoppingheadtitlestate: {
        width: pxToDp(100),
        height: pxToDp(88),
        position: 'absolute',
        right: pxToDp(40),
        top: 0
    },
    myshoppingheadtitlestatetit: {
        fontSize: pxToDp(30),
        color: '#66bfb8',
        textAlign: "right",
        lineHeight: pxToDp(88)
    },
    myshoppingcontainer: {
        paddingHorizontal: pxToDp(40),
        marginTop: pxToDp(98),
        backgroundColor: '#fff',
        marginBottom: pxToDp(100)
    },
    myshoppingcontainershop: {
        width: "100%",
        height: pxToDp(76),
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center'
    },
    myshoppingcontainershoptit: {
        fontSize: pxToDp(30),
        color: '#2d2d2d'
    },
    shopjumparrow: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginLeft: pxToDp(30)
    },
    myshoppingorder: {
        width: "100%",
        height: pxToDp(180),
        display: 'flex',
        alignItems: "center",
        flexDirection: "row"
    },
    ordercontainer: {
        paddingRight: pxToDp(30)
    },
    selectstats: {
        width: pxToDp(40),
        height: pxToDp(40)
    },
    productcontainer: {
        width: pxToDp(434),
        height: pxToDp(130),
        flexDirection: "row",
    },
    orderpic: {
        width: pxToDp(120),
        height: pxToDp(130),
    },
    orderpictrue: {
        width: pxToDp(120),
        height: pxToDp(120),
        marginTop: pxToDp(6)
    },

    productcontainertitle: {
        width: pxToDp(280),
        height: pxToDp(130),
        marginLeft: pxToDp(34),
    },
    productcontainertitleco: {
        width: pxToDp(280),
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: "row"
    },
    pre_sale: {
        fontSize: pxToDp(22),
        color: "#F5222D",
        backgroundColor: '#FFCCC7',
        borderRadius: pxToDp(4),
        paddingHorizontal: pxToDp(8),
        lineHeight: pxToDp(40)
    },
    productcontainertitles: {
        width: pxToDp(200),
        fontSize: pxToDp(30),
        color: '#2d2d2d',
    },
    noproductcontainertitles: {
        width: pxToDp(280),
        fontSize: pxToDp(30),
        color: '#2d2d2d',
    },
    productcontainertitlecon: {
        width: pxToDp(280),
        fontSize: pxToDp(30),
        color: '#2d2d2d',
    },
    producttype: {
        width: pxToDp(280),
        height: pxToDp(30),
        backgroundColor: "#f8f8f8",
        marginTop: pxToDp(10),
        flexDirection: "row",
        justifyContent: "space-between"
    },
    producttypename: {
        width: pxToDp(240),
        height: pxToDp(30),
        fontSize: pxToDp(24),
        color: '#a3a8b0'
    },
    producttypenamemore: {
        width: pxToDp(20),
        height: pxToDp(20),
        marginTop: pxToDp(5)
    },
    producttypenameprice: {
        fontSize: pxToDp(24),
        color: '#2d2d2d',
        position: "absolute",
        left: 0,
        bottom: 0
    },
    producttypenumber: {
        width: pxToDp(150),
        height: pxToDp(50),
        marginLeft: pxToDp(20),
        flexDirection: 'row'
    },
    producttypenumberreduce: {
        width: pxToDp(50),
        height: pxToDp(50),
        backgroundColor: '#f8f8f8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    producttypenumbershow: {
        width: pxToDp(60),
        height: pxToDp(50),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fontSizestyle: {
        fontSize: pxToDp(40)
    },
    producttypenumbershowfont: {
        fontSize: pxToDp(30)
    },
    // 失效商品
    invalid: {
        width: "100%",
        backgroundColor: "white",
        marginTop: pxToDp(10)
    },
    invalidcontent: {
        paddingHorizontal: pxToDp(40)
    },
    invalidcontenttitle: {
        width: "100%",
        height: pxToDp(80),
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'row'
    },
    invalidcontenttitlename: {
        fontSize: pxToDp(30)
    },
    invalidcontentempty: {
        fontSize: pxToDp(30),
        color: "#66bfb8"
    },
    invalidproduct: {
        height: pxToDp(180),
        flexDirection: "row",
        alignItems: "center"
    },
    invalidproductstats: {
        paddingHorizontal: pxToDp(20),
        backgroundColor: "#2d2d2d",
        fontSize: pxToDp(24),
        color: "#fff",
        borderRadius: pxToDp(4)
    },
    invalidproductstatspic: {
        width: pxToDp(120),
        height: pxToDp(120),
        marginLeft: pxToDp(40),
    },
    productcontainertitleinvalid: {
        width: pxToDp(350),
        height: pxToDp(130),
        marginLeft: pxToDp(30),
        position: 'relative'
    },
    producttypenameinvalid: {
        fontSize: pxToDp(24),
        color: '#a3a8b0'
    },
    // 底部合计内容
    bottomcontent: {
        width: "100%",
        height: pxToDp(100),
        backgroundColor: "white",
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    Selection: {
        width: pxToDp(250),
        height: pxToDp(100),
        justifyContent: 'center',
    },
    Selectionall: {
        width: "100%",
        height: pxToDp(50),
    },
    Selectionan: {
        flexDirection: "row",
    },
    Selectionstats: {
        width: pxToDp(450),
        height: pxToDp(100),
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    Selectionbuuton: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginLeft: pxToDp(40),
        marginTop: pxToDp(7)
    },
    Selectionbuutonword: {
        fontSize: pxToDp(30),
        color: '#2d2d2d',
        lineHeight: pxToDp(50),
        marginLeft: pxToDp(15)
    },
    totalprice: {
        width: pxToDp(180),
        height: pxToDp(100),
        flexDirection: 'row'
    },
    buynow: {
        width: pxToDp(240),
        height: pxToDp(100),
        backgroundColor: "#66bfb8"
    },
    total: {
        fontSize: pxToDp(28),
        color: '#2d2d2d',
        lineHeight: pxToDp(100)
    },
    totalpricepri: {
        fontSize: pxToDp(28),
        color: "#66bfb8",
        lineHeight: pxToDp(100)
    },
    buynowbuttom: {
        fontSize: pxToDp(30),
        color: '#f7f8fa',
        lineHeight: pxToDp(100),
        textAlign: 'center'
    },
    // 删除
    delete: {
        width: pxToDp(450),
        height: pxToDp(100),
        backgroundColor: '#66bfb8'
    },
    deleteword: {
        fontSize: pxToDp(30),
        color: '#f7f8fa',
        lineHeight: pxToDp(100),
        textAlign: 'center'
    },
    // 购物车规格选择
    Specificationschoice: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
    },
    specificationschoice: {
        width: "100%",
        backgroundColor: 'white',
        position: 'absolute',
        bottom: pxToDp(100),
        left: 0,
        zIndex: 111
    },
    specification: {
        paddingHorizontal: pxToDp(40),
        paddingVertical: pxToDp(40)
    },
    productinformation: {
        height: pxToDp(120),
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    productinformationpic: {
        width: pxToDp(120),
        height: pxToDp(120),
    },
    productcontainering: {
        width: pxToDp(520),
        height: pxToDp(120),
        position: 'relative'
    },
    productname: {
        fontSize: pxToDp(30),
        color: '#2d2d2d',
        marginTop: pxToDp(20)
    },
    productprice: {
        fontSize: pxToDp(30),
        color: '#2d2d2d',
        fontWeight: "bold",
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    Productspecifications: {
        paddingVertical: pxToDp(50),
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    guige: {
        fontSize: pxToDp(30)
    },
    guigetitle: {
        fontSize: pxToDp(24),
        color: '#2d2d2d',
        backgroundColor: "#f8f8f8",
        borderRadius: pxToDp(4),
        paddingHorizontal: pxToDp(15),
        paddingVertical: pxToDp(6),
        marginRight: pxToDp(20),
        marginBottom: pxToDp(20),
        flexWrap: 'wrap'
    },
    noguigetitle: {
        fontSize: pxToDp(24),
        color: 'white',
        backgroundColor: "#66bfb8",
        borderRadius: pxToDp(4),
        paddingHorizontal: pxToDp(15),
        paddingVertical: pxToDp(6),
        marginRight: pxToDp(20),
        marginBottom: pxToDp(20),
        flexWrap: 'wrap'
    },
    specificationscontent: {
        width: pxToDp(580),
        paddingLeft: pxToDp(30),
        flexDirection: "row",
        flexWrap: 'wrap'
    },
    Submit: {
        width: "100%",
        height: pxToDp(100),
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 111
    },
    Submittitle: {
        width: '100%',
        backgroundColor: "#66bfb8",
        fontSize: pxToDp(30),
        color: 'white',
        textAlign: "center",
        lineHeight: pxToDp(100)
    },
    mask: {
        width: "100%",
        height: pxToDp(1000),
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99
    },
    // 商品数量选择
    commoditynumber: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    numberbox: {
        width: pxToDp(400),
        backgroundColor: 'white',
        borderRadius: pxToDp(20)
    },
    numberboxcon: {
        paddingHorizontal: pxToDp(40),
        paddingVertical: pxToDp(40)
    },
    numberboxtitle: {
        fontSize: pxToDp(30),
        paddingBottom: pxToDp(20),
        color: "black"
    },
    numberboxnum: {
        width: pxToDp(320),
        height: pxToDp(80),
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        flexDirection: 'row'
    },
    numberreduce: {
        width: pxToDp(40),
        height: pxToDp(40),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    numberplus: {
        width: pxToDp(40),
        height: pxToDp(40),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    numbercontetn: {
        fontSize: pxToDp(40),
    },
    subbutton: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: "row",
        marginTop: pxToDp(40)
    },
    cancel: {
        width: pxToDp(150),
        height: pxToDp(70),
        backgroundColor: "#a3a8b0",
        lineHeight: pxToDp(70),
        textAlign: "center",
        color: "white",
        fontSize: pxToDp(30),
    },
    confirm: {
        width: pxToDp(150),
        height: pxToDp(70),
        backgroundColor: "#66bfb8",
        lineHeight: pxToDp(70),
        textAlign: "center",
        color: "white",
        fontSize: pxToDp(30),
    },
    inputcontent: {
        height: pxToDp(80),
        width: pxToDp(160),
        fontSize: pxToDp(30),
        textAlign: "center",
        backgroundColor: "#f2f2f2"
    },
    empatycommodity: {
        width: pxToDp(440),
        backgroundColor: "white"
    },
    empatycommoditytitle: {
        width: "100%",
        height: pxToDp(180),
        borderColor: "#f2f2f2",
        borderBottomWidth: 1,
        borderStyle: "solid",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
    },
    empatycommoditytitlecon: {
        fontSize: pxToDp(30)
    },
    empatycommoditybuuton: {
        width: "100%",
        height: pxToDp(90),
        flexDirection: 'row'
    },
    emptycancel: {
        width: "50%",
        height: pxToDp(90),
        borderColor: "#f2f2f2",
        borderRightWidth: 1,
        borderStyle: "solid",
        lineHeight: pxToDp(90),
        textAlign: 'center',
        fontSize: pxToDp(30)
    },
    emptyconfirm: {
        width: "50%",
        height: pxToDp(90),
        lineHeight: pxToDp(90),
        textAlign: 'center',
        fontSize: pxToDp(30),
        color: "#66bfb8"
    }
})

export default connect(({ commodityModel }) => ({ ...commodityModel }))(ShoppingCart)