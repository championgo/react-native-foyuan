import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';

import {Touchable} from '../components';

import Toast from 'react-native-tiny-toast';

import {NavigationActions, pxToDp, theme, Storage} from '../utils';

import {Tab, Tabs} from 'native-base';

class MyInvoice extends Component {
  static navigationOptions = {
    title: '我的发票',
  };

  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      list: [],
      page: 1,
      pageSize: 10,
      num: true,
      orderList: [],
      select: true,
      shopId: '',
      shop_id: '',
      orderList_status: false,
      product_status: false,
    };
  }
  // 可开票
  exchange = () => {
    this.setState({
      status: 1,
    });
  };
  // 已开票
  Invoiced = () => {
    this.setState({
      status: 0,
    });
  };
  //获取页面数据
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: `Mine/invoice`,
      payload: {
        page: this.state.page,
        pageSize: this.state.pageSize,
      },
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            list: res.data,
          });
          dispatch({
            type: `Mine/updateState`,
            payload: {
              lists: res.data,
            },
          });
          // console.log(this.state.list,"9999")
        }
      },
    });
    dispatch({
      type: `Mine/getProjectOrder`,
      payload: {},
      callback: (res) => {
        console.log(res);
        console.log(1111);
        if (res.error == 0) {
          for (let i in res.data) {
            res.data[i].select = false;
            res.data[i].product_status = false;
          }
          this.setState({
            orderList: res.data,
          });
          dispatch({
            type: `Mine/updateState`,
            payload: {
              orderLists: res.data,
            },
          });
          console.log(this.state.orderList, '0000');
        }
      },
    });
  }
  // 已开票详情
  InvoicedDetail = (item) => {
    const {dispatch} = this.props;
    dispatch(
      NavigationActions.navigate({routeName: 'InvoiceDetail', params: item}),
    );
  };
  renderItem = ({item}) => {
    return (
      <View>
        <Touchable onPress={() => this.InvoicedDetail(item)}>
          {/* {list.map((item) => ( */}
          <View style={styles.list}>
            <View style={styles.list_left}>
              <View style={styles.left_price}>
                <Text style={styles.amount}>{item.amount}元</Text>
              </View>
              <View>
                <Text style={styles.invoice_client}>{item.invoice_client}</Text>
                <Text style={styles.created_at}>{item.created_at}</Text>
              </View>
            </View>
            <View style={styles.list_left}>
              {item.invoice_status == 0 ? (
                <Text style={styles.invoice_status}>开票中</Text>
              ) : (
                <Text style={styles.invoice_status}>已开票</Text>
              )}
              <Image
                style={styles.icon}
                source={require('../images/next.png')}></Image>
            </View>
          </View>
        </Touchable>
        {/* ))} */}
      </View>
    );
  };
  onEndReached = () => {
    if (this.state.num == true) {
      let a = this.state.page + 1;
      this.setState(
        {
          page: a,
        },
        () => {
          this.props.dispatch({
            type: `Mine/invoice`,
            payload: {
              page: a,
              pageSize: this.state.pageSize,
            },
            callback: (res) => {
              console.log(res);
              if (res.error == 0) {
                if (res.data.length < this.state.pageSize) {
                  this.setState({
                    num: false,
                  });
                }
                if (this.state.list.length <= 0) {
                  this.setState({
                    list: res.data,
                  });
                  this.props.dispatch({
                    type: `Mine/updateState`,
                    payload: {
                      lists: res.data,
                    },
                  });
                } else {
                  let arr = this.state.list;
                  let c = arr.concat(res.data);
                  this.setState({
                    list: c,
                  });
                  this.props.dispatch({
                    type: `Mine/updateState`,
                    payload: {
                      lists: c,
                    },
                  });
                }
              }
            },
          });
        },
      );
    }
  };

  // 选可开票的数据
  noselect = (item) => {
    if (this.state.shop_id && item.shop_id != this.state.shop_id) {
      Toast.show('不同店铺不可合并开票', {
        position: 0,
        duration: 2000,
      });
      return;
    }
    let list = this.state.orderList;
    for (let i in list) {
      if (item.id == list[i].id) {
        list[i].select = !list[i].select;
        this.setState({
          orderList: list,
        });
        this.props.dispatch({
          type: `Mine/updateState`,
          payload: {
            orderLists: list,
          },
        });
      }
    }
    //检测(所有订单均不选择时,开票店铺清空shop_id='')
    let len = 0;
    for (let i in list) {
      if (list[i].select) {
        len++;
      }
    }
    this.setState({
      shop_id: len == 0 ? '' : item.shop_id,
    });
  };

  // 查看更多
  next_arrow = (item) => {
    console.log('999');

    // this.setState({
    //   product_status: true,
    // });
    console.log('999', this.state.orderList.length);

    for (var a = 0; a < this.state.orderList.length; a++) {
      console.log('7777');
      if (item.id == this.state.orderList[a].id) {
        this.state.orderList[a].product_status = true;
      }
      this.setState({
        orderList: this.state.orderList,
      });
      this.props.dispatch({
        type: `Mine/updateState`,
        payload: {
          orderLists: this.state.orderList,
        },
      });
      console.log(this.state.orderList);
    }
  };
  up_arrow = (item) => {
    console.log('2222');
    this.setState({
      product_status: false,
    });
    for (var a = 0; a < this.state.orderList.length; a++) {
      // console.log(item.id,this.state.orderList)

      if (item.id == this.state.orderList[a].id) {
        console.log(this.state.orderList[a].product_status, '0000');
        this.state.orderList[a].product_status = false;
      }
      this.setState({
        orderList: this.state.orderList,
      });
      this.props.dispatch({
        type: `Mine/updateState`,
        payload: {
          orderLists: this.state.orderList,
        },
      });
      // console.log(this.state.orderList)
    }
  };

  // 去开票
  openButton = () => {
    let invoiceList = [];
    let invoiceMoney = 0;
    for (let i in this.state.orderList) {
      if (this.state.orderList[i].select) {
        invoiceList.push(this.state.orderList[i]);
        invoiceMoney =
          invoiceMoney + Number(this.state.orderList[i].real_total_money);
      }
    }
    if (invoiceList.length == 0) {
      Toast.show('请选择需开票的订单', {
        position: 0,
        duration: 2000,
      });
      return;
    } else {
      let params = {
        invoiceList: invoiceList,
        invoiceShop: this.state.shop_id,
        invoiceMoney: invoiceMoney,
      };
      //存储
      Storage.set('params', params);
      this.props.dispatch(
        NavigationActions.navigate({routeName: 'MineInvoiceForm'}),
      );
    }
  };

  render() {
    const {
      Mine: {lists, orderLists},
    } = this.props;
    const {status, list, orderList, select, product_status} = this.state;
    // console.log('MyInvoice' + JSON.stringify(lists))
    return (
      <SafeAreaView
        style={[status == 0 ? styles.container : styles.containers]}>
        <Tabs tabBarUnderlineStyle={[styles.state]}>
          <Tab
            heading="已开票"
            activeTabStyle={{backgroundColor: 'white'}}
            tabStyle={{backgroundColor: 'white'}}
            activeTextStyle={{color: 'black'}}
            textStyle={{color: 'black'}}>
            <View>
              {lists.length > 0 ? (
                <FlatList
                  data={lists}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                  onEndReached={() => {
                    this.onEndReached();
                  }}
                  contentContainerStyle={styles.productlist}
                  onEndReachedThreshold={0.2}
                  refreshing={true}
                  extraData={this.state.status}
                  // numColumns={2}
                  // ref={(ref) => {
                  //   this.list = ref;
                  // }}

                  // extraData={selectedId}
                />
              ) : (
                <View>
                  <View style={styles.foot}>
                    <View>
                      <Image
                        style={styles.searchicon}
                        source={require('../images/illustration_search.png')}></Image>
                      <Text style={styles.foot_test}>您还没有开过发票哦</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </Tab>
          <Tab
            heading="可开票"
            activeTabStyle={{backgroundColor: 'white'}}
            tabStyle={{backgroundColor: 'white'}}
            activeTextStyle={{color: 'black'}}
            textStyle={{color: 'black'}}>
            <ScrollView>
              <View>
                {orderLists.length > 0 ? (
                  <View>
                    <View style={styles.baseBackgroundColor}></View>
                    <View style={styles.orderList}>
                      <Text style={styles.body2_text}>
                        请选择需要开票的订单（订单不可跨店铺开票）
                      </Text>
                    </View>
                    <View style={styles.orderList_main}>
                      <View>
                        {orderLists.map((item) => (
                          <View style={styles.body2_list}>
                            <View style={styles.iconfont}>
                              {item.select == false ? (
                                <Touchable onPress={() => this.noselect(item)}>
                                  <View>
                                    <Image
                                      style={styles.noselect}
                                      source={require('../images/noselect.png')}></Image>
                                  </View>
                                </Touchable>
                              ) : (
                                <Touchable onPress={() => this.noselect(item)}>
                                  <View>
                                    <Image
                                      style={styles.noselect}
                                      source={require('../images/select.png')}></Image>
                                  </View>
                                </Touchable>
                              )}
                            </View>
                            <View style={styles.body2_listmain}>
                              <View style={styles.order_no}>
                                <Text>订单编号:{item.order_no}</Text>
                                <Text>{item.shop?.title}</Text>
                              </View>
                              {!item.product_status ? (
                                <Text
                                  style={styles.line_product}
                                  numberOfLines={1}
                                  ellipsizeMode="tail">
                                  {item?.product[0].product_name}
                                </Text>
                              ) : (
                                <View>
                                  {item.product.map((items) => (
                                    <Text
                                      style={styles.line_product}
                                      numberOfLines={1}
                                      ellipsizeMode="tail">
                                      {items.product_name}
                                    </Text>
                                  ))}
                                </View>
                              )}
                              {item.product?.length > 1 ? (
                                <View>
                                  {item.product_status == false ? (
                                    <Touchable
                                      onPress={() => this.next_arrow(item)}
                                      style={styles.flexs}>
                                      <Text style={styles.product}>
                                        所有{item.product.length}件商品
                                      </Text>
                                      <View>
                                        <Image
                                          style={styles.next_arrow}
                                          source={require('../images/next_arrow.png')}></Image>
                                      </View>
                                    </Touchable>
                                  ) : (
                                    <Touchable
                                      onPress={() => this.up_arrow(item)}
                                      style={styles.flexs}>
                                      <Text style={styles.product}>
                                        所有{item.product.length}件商品
                                      </Text>
                                      <View>
                                        <Image
                                          style={styles.next_arrow}
                                          source={require('../images/up_arrow.png')}></Image>
                                      </View>
                                    </Touchable>
                                  )}
                                </View>
                              ) : null}
                              <View style={styles.pay_time}>
                                <View>
                                  <Text style={styles.pay_times}>
                                    {item.pay_time}
                                  </Text>
                                </View>
                                <View>
                                  <Text style={styles.real_total_money}>
                                    开票金额: ¥{item.real_total_money}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                  </View>
                ) : (
                  <View>
                    <View style={styles.foot}>
                      <View>
                        <Image
                          style={styles.searchicon}
                          source={require('../images/illustration_search.png')}></Image>
                        <Text style={styles.foot_test}>
                          您还没有可开票的订单哦
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
            {orderLists.length > 0 ? (
              <View>
                <View style={styles.footers}>
                  <Touchable
                    style={styles.openButton}
                    onPress={() => {
                      this.openButton();
                    }}>
                    <Text style={styles.button}>去开票</Text>
                  </Touchable>
                </View>
              </View>
            ) : null}
          </Tab>
        </Tabs>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baseBackgroundColor,
  },
  containers: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  icon: {
    width: pxToDp(30),
    height: pxToDp(30),
  },
  baseBackgroundColor: {
    backgroundColor: theme.baseBackgroundColor,
    height: pxToDp(10),
  },
  top: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pxToDp(88),
    alignItems: 'center',
    width: '100%',
  },
  top_title: {
    width: '50%',
    height: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    height: '100%',
    fontSize: pxToDp(32),
    lineHeight: pxToDp(88),
  },
  state: {
    // borderBottomColor: theme.baseColor,
    // borderBottomWidth: pxToDp(4),
    backgroundColor: theme.baseColor,
    // width:pxToDp(64),
  },
  main: {
    marginTop: pxToDp(10),
    backgroundColor: '#fff',
  },
  foot: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: pxToDp(30),
    marginBottom: pxToDp(30),
  },
  footers: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  button: {
    height: pxToDp(100),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.baseColor,
    color: '#fff',
    textAlign: 'center',
    lineHeight: pxToDp(100),
  },
  searchicon: {
    width: pxToDp(360),
    height: pxToDp(150),
    marginBottom: pxToDp(20),
  },
  foot_test: {
    textAlign: 'center',
    color: '#a3a8b0',
  },
  list: {
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: pxToDp(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    lineHeight: 2,
    height: pxToDp(170),
  },
  list_left: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left_price: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#f8f8f8',
    borderRightWidth: pxToDp(4),
    height: pxToDp(60),
    marginRight: pxToDp(15),
  },
  amount: {
    color: theme.baseColor,
    fontSize: pxToDp(30),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: pxToDp(170),
    paddingRight: pxToDp(15),
  },
  invoice_client: {
    fontSize: pxToDp(30),
  },
  created_at: {
    color: '#a3a8b0',
    fontSize: pxToDp(24),
    marginTop: pxToDp(4),
  },
  invoice_status: {
    color: '#de6449',
    fontSize: pxToDp(24),
    marginRight: pxToDp(4),
  },
  orderList: {
    paddingTop: pxToDp(40),
    // paddingBottom:pxToDp(40),
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
  },
  noselect: {
    width: pxToDp(36),
    height: pxToDp(36),
  },
  body2_text: {
    fontSize: pxToDp(24),
    color: '#a3a8b0',
  },
  orderList_main: {
    width: '100%',
    padding: pxToDp(40),
  },
  body2_list: {
    marginBottom: pxToDp(40),
    backgroundColor: '#f8f8f8',
    borderRadius: pxToDp(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: pxToDp(30),
    width: '100%',
    overflow: 'hidden',
  },
  body2_listmain: {
    width: '100%',
  },
  iconfont: {
    width: '10%',
    height: '10%',
  },
  order_no: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    // backgroundColor:theme.baseColor,
    width: '90%',
  },
  line_product: {
    width: '90%',
    marginTop: pxToDp(4),
    marginBottom: pxToDp(4),
    fontSize: pxToDp(24),
  },
  pay_time: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    width: '90%',
  },
  pay_times: {
    fontSize: pxToDp(24),
    color: '#a3a8b0',
  },
  real_total_money: {
    color: theme.baseColor,
  },
  product: {
    fontSize: pxToDp(24),
    color: '#a3a8b0',
  },
  next_arrow: {
    width: pxToDp(20),
    height: pxToDp(20),
  },
  flexs: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default connect(({Mine: {...Mine}}) => ({Mine}))(MyInvoice);
