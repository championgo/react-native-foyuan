import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, ScrollView, Text, Modal, TouchableWithoutFeedback, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions, pxToDp, theme, Storage } from '../utils'
import Touchable from '../components/Touchable';
import { Loading } from '../components';
import numeral from 'numeral';
import 'numeral/locales/chs';
numeral.locale('chs');

class CombinationDiscount extends Component {
    static navigationOptions = {
        title: '组合优惠',
    }

    constructor(props) {
        super(props);
        this.state = {
            // 加载状态
            meauListLoad: true,
            getGroupList: [],
            tabindex: 0,
            // 修改数量
            number: "",
            Content: [],
            modalVisiblenumb: false,
            Information: ''
        };
    }

    async componentDidMount() {
        this.initService();
        this.setState({
            Information: await Storage.get("user_info")
        })
    }

    initService = () => {
        const { dispatch, navigation: { state: { params } } } = this.props;
        dispatch({
            type: 'commodityModel/getGroupList',
            payload: {
                product_id: params
            },
            callback: res => {
                if (res.error === 0) {
                    res.data.map(item => {
                        item.num = 1;
                    });
                    this.setState({
                        meauListLoad: false,
                        getGroupList: res.data
                    })
                }
            }
        })
    }
    Reduce = (item) => {
        const newGetGroupList = this.state.getGroupList.map(i => {
            if (i.id == item.id) {
                if (i.num > 1) {
                    i.num = i.num - 1;
                }
            }
            return i;
        })
        this.setState({
            getGroupList: newGetGroupList
        }, () => {
            const { dispatch } = this.props;
            dispatch({
                type: 'commodityModel/chooseGroup',
                payload: {
                    id: item.id,
                    num: item.num - 1
                },
                callback: res => {
                    if (res.error === 0) {
                        const newGetGroupListreturn = this.state.getGroupList.map(a => {
                            if (a.id == res.data.id) {
                                a.price = res.data.price,
                                    a.discounts = res.data.discounts
                            }
                            return a
                        })
                        this.setState({
                            getGroupList: newGetGroupListreturn
                        })
                    }
                }
            })
        })
    }
    Pius = (item) => {
        const newGetGroupList = this.state.getGroupList.map(i => {
            if (i.id == item.id) {
                i.num = i.num + 1;
            }
            return i;
        });
        this.setState({
            getGroupList: newGetGroupList
        }, () => {
            const { dispatch } = this.props;
            dispatch({
                type: 'commodityModel/chooseGroup',
                payload: {
                    id: item.id,
                    num: item.num + 1
                },
                callback: res => {
                    if (res.error === 0) {
                        const newGetGroupListreturn = this.state.getGroupList.map(a => {
                            if (a.id == res.data.id) {
                                a.price = res.data.price,
                                    a.discounts = res.data.discounts
                            }
                            return a
                        })
                        this.setState({
                            getGroupList: newGetGroupListreturn
                        })
                    }
                }
            })
        })
    }
    // 切换组合套餐
    Selectbutton = (idx) => {
        this.setState({
            tabindex: idx
        })
    }
    // 修改数量弹窗
    Modifiedquantity = (item) => {
        this.setState({
            number: item.num,
            Content: item,
            modalVisiblenumb: true
        })
    }
    // 修改数量减
    Nmubereduce = () => {
        if (this.state.number > 1) {
            this.setState({
                number: this.state.number - 1
            })
        }
    }
    // 修改数量加
    Nmuberplus = () => {
        this.setState({
            number: this.state.number + 1
        })
    }
    // 取消修改数量
    Cancel = () => {
        this.setState({
            modalVisiblenumb: false
        })
    }
    // 确认修改数量
    Confirm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'commodityModel/chooseGroup',
            payload: {
                id: this.state.Content.id,
                num: this.state.number
            },
            callback: res => {
                if (res.error === 0) {
                    const newGetGroupListreturn = this.state.getGroupList.map(a => {
                        if (a.id == res.data.id) {
                            a.price = res.data.price,
                                a.discounts = res.data.discounts,
                                a.num = this.state.number
                        }
                        return a
                    })
                    this.setState({
                        getGroupList: newGetGroupListreturn,
                        modalVisiblenumb: false
                    })
                }
            }
        })
    }

    // 立即购买
    Buynow = () => {
        const { dispatch } = this.props;
        const { getGroupList, tabindex } = this.state;
        const params = {
            product_sku_id: getGroupList[tabindex].id,
            num: getGroupList[tabindex].num
        };
        dispatch(NavigationActions.navigate({ routeName: 'Settlement', params }));
    }

    render() {
        if (this.state.meauListLoad) {
            return <Loading />
        }
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.searchbackground}>
                        <View style={styles.content}>
                            {
                                this.state.getGroupList.map((item, idx) => (
                                    <View key={`getGroupList_${idx}`}>
                                        <View style={styles.Combination_discount}>
                                            <View style={styles.selectbutton}>
                                                <Touchable onPress={() => this.Selectbutton(idx)}>
                                                    {
                                                        this.state.tabindex == idx ?
                                                            <Image style={styles.selectcho} source={require('../images/groupselect.png')}></Image>
                                                            :
                                                            <Image style={styles.selectcho} source={require('../images/noselect.png')}></Image>
                                                    }
                                                </Touchable>
                                            </View>
                                            <View style={styles.selectcontent}>
                                                <View style={styles.titlecontent}>
                                                    <Text style={styles.discount_name}></Text>
                                                    <Text style={styles.free_shipping}>包邮</Text>
                                                    <Text style={styles.discount}>{item.discount / 10}折，省{Number(item.discounts)}元</Text>
                                                </View>
                                                {
                                                    item.group.map((itam, index) => (
                                                        <View style={styles.allcontent} key={`group_${index}`}>
                                                            <View style={styles.combinationcontent}>
                                                                <View style={styles.combinationcontentpic}>
                                                                    <Image style={styles.combinationcontentimage} source={{ uri: itam.thumb }}></Image>
                                                                </View>
                                                                <View style={styles.combinationtitle}>
                                                                    <View style={styles.combinationtitlecon}>
                                                                        {
                                                                            item.is_distribution == 1 && this.state.Information.distributor_status == 2 ?
                                                                                <Text style={styles.distribution}>分销</Text> : null
                                                                        }
                                                                        <Text style={styles.combinationname} numberOfLines={1}>{itam.title}</Text>
                                                                    </View>
                                                                    <View>
                                                                        <Text style={styles.product_description} numberOfLines={1}>{itam.keywords}</Text>
                                                                    </View>
                                                                    <View>
                                                                        <Text style={styles.product_price}>{itam.price}元</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    ))
                                                }
                                                <View style={styles.specification_selection}>
                                                    <Text style={styles.specification_selectiontitle}>选择规格：</Text>
                                                    <View style={styles.selection_con}>
                                                        <Text style={styles.specification_selectionreduce} onPress={() => this.Reduce(item, idx)}>—</Text>
                                                        <Text style={styles.specification_selectionnumber} onPress={() => this.Modifiedquantity(item)}>{item.num}</Text>
                                                        <Text style={styles.specification_selectionreduce} onPress={() => this.Pius(item, idx)}>+</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.specification_selection}>
                                                    <Text style={styles.specification_selectiontitle}>商品总价：</Text>
                                                    <Text style={styles.total_price}>{numeral(item.price).format('$0,0.00')}</Text>
                                                    <View style={styles.original_price}>
                                                        <Text style={styles.original_pricename}>原价：{numeral(item.price + item.discounts).format('$0,0.00')}</Text>
                                                        <Text style={styles.slash}></Text>
                                                    </View>
                                                </View>
                                                {
                                                    item.is_distribution == 1 ?
                                                        <View style={styles.distribution_profit}>
                                                            <Text style={styles.specification_selectiontitle}>分销收益：</Text>
                                                            <View style={styles.distribution_profitcon}>
                                                                <Text style={styles.profit_price}>一级预计可赚{item.commission_lv1}元</Text>
                                                                <Text style={styles.profit_prices}>二级预计可赚{item.commission_lv2}元</Text>
                                                            </View>
                                                        </View>
                                                        : null
                                                }
                                            </View>
                                        </View>


                                    </View>
                                ))
                            }
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.purchase}>
                    <Text style={styles.purchasecontent} onPress={this.Buynow}>立即购买</Text>
                </View>

                {/* 修改组合优惠数量 */}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisiblenumb}
                    onRequestClose={() => this.setState({ modalVisiblenumb: false })}>
                    <TouchableWithoutFeedback onPress={() => this.setState({ modalVisiblenumb: false })}>
                        <View style={styles.commoditynumber}>
                            <View style={styles.numberbox}>
                                <View style={styles.numberboxcon}>
                                    <Text style={styles.numberboxtitle}>修改购买数量</Text>
                                    <View style={styles.numberboxnum}>
                                        <View style={styles.numberreduce}>
                                            <Text style={styles.numbercontetn} onPress={this.Nmubereduce}>—</Text>
                                        </View>
                                        <TextInput value={String(this.state.number)} style={styles.inputcontent} onChangeText={(number) => this.setState({ number: Number(number) == "" ? '' : Number(number) })} />
                                        <View style={styles.numberplus}>
                                            <Text style={styles.numbercontetn} onPress={this.Nmuberplus}>+</Text>
                                        </View>
                                    </View>
                                    <View style={styles.subbutton}>
                                        <Text style={styles.cancel} onPress={this.Cancel}>取消</Text>
                                        <Text style={styles.confirm} onPress={this.Confirm}>确认</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
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
        backgroundColor: "white",
        paddingBottom: pxToDp(90)
    },
    content: {
        marginHorizontal: pxToDp(40)
    },
    Combination_discount: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: pxToDp(30),
        borderStyle: 'solid',
        borderBottomWidth: pxToDp(2),
        borderColor: '#ECECEC'
    },
    selectbutton: {
        width: pxToDp(40),
        height: pxToDp(40),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectcho: {
        width: pxToDp(36),
        height: pxToDp(36)
    },
    selectcontent: {
        width: pxToDp(600),
        marginBottom: pxToDp(30)
    },
    titlecontent: {
        height: pxToDp(40),
        flexDirection: 'row',
        alignItems: 'center',
    },
    discount_name: {
        fontSize: pxToDp(28),
        color: '#A3A8B0',
        lineHeight: pxToDp(40)
    },
    free_shipping: {
        height: pxToDp(30),
        fontSize: pxToDp(22),
        paddingHorizontal: pxToDp(10),
        borderRadius: pxToDp(8),
        borderWidth: pxToDp(1),
        borderColor: "#FA551D",
        color: "#FA551D",
        borderStyle: "solid",
        marginLeft: pxToDp(15)
    },
    discount: {
        fontSize: pxToDp(22),
        color: '#FA551D',
        marginLeft: pxToDp(15)
    },
    allcontent: {
        marginTop: pxToDp(28)
    },
    combinationcontent: {
        display: 'flex',
        flexDirection: 'row'
    },
    combinationcontentpic: {
        width: pxToDp(120),
        height: pxToDp(120),
        borderRadius: pxToDp(8),
    },
    combinationcontentimage: {
        width: pxToDp(120),
        height: pxToDp(120)
    },
    combinationtitle: {
        height: pxToDp(120),
        marginLeft: pxToDp(24),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    combinationtitlecon: {
        height: pxToDp(40),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    distribution: {
        backgroundColor: '#FFD591',
        color: "#FA551D",
        fontSize: pxToDp(22),
        paddingHorizontal: pxToDp(10),
        borderRadius: pxToDp(4)
    },
    combinationname: {
        width: pxToDp(350),
        fontSize: pxToDp(28),
        color: '#2D2D2D',
        marginLeft: pxToDp(10)
    },
    product_description: {
        width: pxToDp(430),
        fontSize: pxToDp(22),
        color: "#A3A8B0"
    },
    product_price: {
        fontSize: pxToDp(24),
        color: "#A3A8B0"
    },
    specification_selection: {
        marginTop: pxToDp(10),
        flexDirection: "row",
        height: pxToDp(40),
        alignItems: 'center'
    },
    specification_selectiontitle: {
        fontSize: pxToDp(24),
        color: "#A3A8B0"
    },
    selection_con: {
        flexDirection: 'row'
    },
    specification_selectionreduce: {
        lineHeight: pxToDp(40),
        paddingHorizontal: pxToDp(6),
        fontSize: pxToDp(28),
        color: "#A3A8B0"
    },
    specification_selectionnumber: {
        width: pxToDp(80),
        lineHeight: pxToDp(40),
        textAlign: 'center',
        fontSize: pxToDp(24),
        color: "#A3A8B0"
    },
    total_price: {
        color: '#66BFB9',
        fontSize: pxToDp(32)
    },
    original_price: {
        height: pxToDp(40),
        marginLeft: pxToDp(20),
        position: 'relative'
    },
    original_pricename: {
        fontSize: pxToDp(20),
        color: '#D8D8D8',
        lineHeight: pxToDp(40),
        textAlign: 'center'
    },
    slash: {
        width: "100%",
        height: pxToDp(2),
        backgroundColor: '#D8D8D8',
        position: 'absolute',
        top: pxToDp(20),
        left: 0
    },
    distribution_profit: {
        marginTop: pxToDp(10),
        display: 'flex',
        flexDirection: 'row'
    },
    profit_price: {
        fontSize: pxToDp(24),
        color: '#66BFB9'
    },
    profit_prices: {
        fontSize: pxToDp(24),
        color: '#66BFB9',
        marginTop: pxToDp(10)
    },
    // 购买按钮
    purchase: {
        width: '100%',
        height: pxToDp(90),
    },
    purchasecontent: {
        width: '100%',
        height: pxToDp(90),
        color: '#FFFFFF',
        fontSize: pxToDp(28),
        textAlign: 'center',
        lineHeight: pxToDp(90),
        backgroundColor: "#FA551D"
    },

    // 弹出窗
    // 商品数量选择
    commoditynumber: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        position: "relative",
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

export default connect(({ commodityModel }) => ({ ...commodityModel }))(CombinationDiscount)
