import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import { Touchable, Search , Loading}  from '../components';

import {NavigationActions, pxToDp, theme} from '../utils';

class CommodityArea extends Component {
  static navigationOptions = {
    title: '商品分类列表',
  };
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      logo: '',
      order: 1, //1综合 5销量 3价格倒叙 2价格正序
      page: 1,
      shopList: [],
      selectedId: true,
      status: true,
      id: '',
      label: false,
      modalVisible: false,
      isclick: true,
      minimum: '',
      highest: '',
      label_list: [],
      label_id: [],
      meauListLoad:true
    };
  }

  //获取商铺数据
  componentDidMount = () => {
    this.shop_list();
    this.props.dispatch({
      type: `SearchModel/labelList`,
      payload: {},
      callback: (res) => {
        console.log(res);
        console.log('6666');
        if (res.error == 0) {
          this.setState({
            label_list: res.data,
          });
          console.log(this.state.label_list)
        }
      },
    });
  };
  shop_list = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: {id},
        },
      },
    } = this.props;
    this.setState({
      id: id,
    });
    dispatch({
      type: `SearchModel/get_list`,
      payload: {
        category_id: id,
        order: this.state.order,
        page: this.state.page,
        pageSize: 8,
      },
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            shopList: res.data,
            meauListLoad:false
          });
        }
      },
    });
  };
  // 综合
  comprehensive = () => {
    this.setState(
      {
        order: 1,
        page: 1,
        meauListLoad:true,
        status:true,
      },
      () => {
        this.shop_list();
        this.list.scrollToIndex({viewPosition: 0, index: 0});
      },
    );
  };
  // 销量
  volume = () => {
    this.setState(
      {
        order: 5,
        page: 1,
        meauListLoad:true,
        status:true,
      },
      () => {
        this.shop_list();
        this.list.scrollToIndex({viewPosition: 0, index: 0});
      },
    );
  };
  // 筛选
  new = () => {
    this.state.label = !this.state.label;
    this.setState(
      {
        label: this.state.label,
        status:true,
        // page: 1,
      },
      () => {
        this.setModalVisible(this.state.label);
        // this.list.scrollToIndex({viewPosition: 0, index: 0});
        // this.shop_list();
      },
    );
  };

  //   弹窗
  setModalVisible = (a) => {
    this.setState({
      modalVisible: a,
    });
  };

  // 点击价格
  price = () => {
    this.setState(
      {
        order: 2,
        page: 1,
        meauListLoad:true,
        status:true,
      },
      () => {
        this.list.scrollToIndex({viewPosition: 0, index: 0});
        this.shop_list();
      },
    );
  };

  // 点击正序
  price_pull = () => {
    this.setState(
      {
        order: 3,
        page: 1,
        meauListLoad:true,
        status:true,
      },
      () => {
        this.list.scrollToIndex({viewPosition: 0, index: 0});
        this.shop_list();
      },
    );
  };
  // 点击倒序
  price_push = () => {
    this.setState(
      {
        order: 2,
        page: 1,
        meauListLoad:true,
        status:true,
      },
      () => {
        this.list.scrollToIndex({viewPosition: 0, index: 0});
        this.shop_list();
      },
    );
  };
  // 加载
  onEndReached = () => {
    if (this.state.status == true) {
      const {
        dispatch,
        navigation: {
          state: {
            params: {id},
          },
        },
      } = this.props;
      let a = this.state.page + 1;
      this.setState(
        {
          page: a,
          id: id,
        },
        () => {
          this.props.dispatch({
            type: `SearchModel/get_list`,
            payload: {
              category_id: id,
              label_id: this.state.label_id,
              order: this.state.order,
              page: this.state.page,
              pageSize: 8,
              max: this.state.highest,
              min: this.state.minimum,
            },
            callback: (res) => {
              if (res.error == 0) {
                if (res.data.length < 8) {
                  this.setState({
                    status: false,
                  });
                }
                if (this.state.shopList.length <= 0) {
                  this.setState({
                    shopList: res.data,
                  });
                } else {
                  let arr = this.state.shopList;
                  let c = arr.concat(res.data);
                  this.setState({
                    shopList: c,
                  });
                }

                // console.log(res.data);
              }
            },
          });
        },
      );
    }
  };
  // 跳到详情
  record = (item) => {
    const {dispatch} = this.props;
    dispatch(
      NavigationActions.navigate({routeName: 'CommodityDetail', params: item}),
    );
  };

  //   跳到购物车
  shoppingcar = () => {
    this.props.dispatch(
      NavigationActions.navigate({routeName: 'ShoppingCart'}),
    );
  };

  renderItem = ({item}) => {
    return (
      <View style={styles.commoditys}>
        {this.state.shopList.length > 0 ? (
          <Touchable onPress={() => this.record(item)}>
            <View style={styles.productlists}>
              {/* {shopList.map((item) => ( */}

              <View style={styles.commodity}>
                <Image
                  style={styles.commodityimage}
                  source={{
                    uri: item.thumb,
                  }}></Image>
                <View style={styles.commoditydetails}>
                  <Text
                    style={styles.commoditytitle}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    <Text>{item.title}</Text>
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.commodityintroduce}>
                    {item.keywords}
                  </Text>
                  <Text style={styles.commodityprice}>￥{item.price}</Text>
                </View>
              </View>

              {/* ))} */}
            </View>
          </Touchable>
        ) : (
          <View>
            {/* <Image
              style={styles.none}
              source={require('../images/none.png')}></Image> */}
            {/* <Text>找不到符合条件的商品哦</Text> */}
          </View>
        )}
      </View>
    );
  };

  /**
   * 搜索
   */
  goSearch = () => {
    const {dispatch} = this.props;
    dispatch(NavigationActions.navigate({routeName: 'Search'}));
  };
  //   最低价
  onChangeText = (minimum) => {
    this.setState({
      minimum: minimum,
    });
  };
  // 最高价
  onChangehighest = (highest) => {
    this.setState({
      highest: highest,
    });
  };

  // 筛选的确定
  determine = () => {
    this.setState({
      modalVisible: false,
      label: false,
      
    });

    const {
      dispatch,
      navigation: {
        state: {
          params: {id},
        },
      },
    } = this.props;
    this.setState({
      id: id,
      meauListLoad:true,
      status:true,
    });
    dispatch({
      type: `SearchModel/get_list`,
      payload: {
        category_id: id,
        label_id: this.state.label_id,
        order: this.state.order,
        page: 1,
        pageSize: 8,
        max: this.state.highest,
        min: this.state.minimum,
      },
      callback: (res) => {
        console.log(res, '8888');
        if (res.error == 0) {
          this.setState({
            shopList: res.data,
            meauListLoad:false,
            status:true,
          },()=>{
            if(res.data.length > 0){
              this.list.scrollToIndex({viewPosition: 0, index: 0});
            }
          });
        }
      },
    });
  };

  // 筛选的清空
  empty =()=>{
    console.log("222")
    
    let list = this.state.label_list;
    for (let i in list) {
      list[i].select = false
    }
    this.setState({
      minimum: '',
      highest: '',
      label_id:[],
      label_list: list,
    });
  }

  // label
  title = (item) => {
    let list = this.state.label_list;
    for (let i in list) {
      if (item.id == list[i].id) {
        let arr = this.state.label_id;
        if (!list[i].select) {
          arr.push(item.id);
        } else {
          for (var a = 0; a < arr.length; a++) {
            if (arr[a] == item.id) {
              arr.splice(a, 1);
            }
          }
        }
        list[i].select = !list[i].select;
        this.setState({
          label_list: list,
          label_id: arr,
        });
      }
    }
  };

  render() {
    const {
      logo,
      title,
      shopList,
      order,
      selectedId,
      label,
      modalVisible,
      minimum,
      highest,
      label_list,
      meauListLoad
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {/* //   <ScrollView> */}
        <View style={styles.top}>
          <View>
            <Search
              onPress={() => this.goSearch()}
              style={styles.searchframe}
            />
          </View>
          <Touchable
            style={styles.searchbutton}
            onPress={() => this.shoppingcar()}>
            <Image
              style={styles.searchicon}
              source={require('../images/h_car.png')}></Image>
          </Touchable>
        </View>

        <View style={styles.main}>
          <View>
            <View style={styles.shop_main}>
              {order == 1 ? (
                <Text style={styles.order}>综合</Text>
              ) : (
                <Text onPress={this.comprehensive} style={styles.orders}>
                  综合
                </Text>
              )}
              {order == 5 ? (
                <Text style={styles.order}>销量</Text>
              ) : (
                <Text onPress={this.volume} style={styles.orders}>
                  销量
                </Text>
              )}
              {order == 3 || order == 2 ? (
                <View style={styles.flex_price}>
                  {order == 3 ? (
                    <Touchable onPress={this.price_push}>
                      <View style={styles.flex_price}>
                        <Text style={styles.order}>价格</Text>
                        <Image
                          source={require('../images/push.png')}
                          style={styles.prices}
                        />
                      </View>
                    </Touchable>
                  ) : (
                    <Text></Text>
                  )}
                  {order == 2 ? (
                    <Touchable onPress={this.price_pull}>
                      <View style={styles.flex_price}>
                        <Text style={styles.order}>价格</Text>
                        <Image
                          source={require('../images/pull.png')}
                          style={styles.prices}
                        />
                      </View>
                    </Touchable>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              ) : (
                <Touchable onPress={this.price}>
                  <View style={styles.flex_price}>
                    <Text style={styles.orders}>价格</Text>
                    <Image
                      source={require('../images/price.png')}
                      style={styles.prices}
                    />
                  </View>
                </Touchable>
              )}
              {label ? (
                <Touchable onPress={this.new}>
                  <View style={styles.flex_price}>
                    <Text style={styles.order} onPress={this.new}>
                      筛选
                    </Text>
                    <Image
                      source={require('../images/screen_true.png')}
                      style={styles.prices}
                    />
                  </View>
                </Touchable>
              ) : (
                <Touchable onPress={this.new}>
                  <View style={styles.flex_price}>
                    <Text style={styles.orders}>筛选</Text>
                    <Image
                      source={require('../images/screen_false.png')}
                      style={styles.prices}
                    />
                  </View>
                </Touchable>
              )}
            </View>
          </View>
        </View>
        {/* // </ScrollView> */}

        {this.state.shopList.length > 0 ? (
          <FlatList
            data={shopList}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
            onEndReached={() => {
              this.onEndReached();
            }}
            contentContainerStyle={styles.productlist}
            onEndReachedThreshold={0.2}
            refreshing={true}
            extraData={this.state.status}
            numColumns={2}
            ref={(ref) => {
              this.list = ref;
            }}

            // extraData={selectedId}
          />
        ) : (
          <View style={styles.none_main}>
           <View>
           <Image
          style={styles.none}
          source={require('../images/none.png')}></Image>
            <Text style={styles.none_text}>找不到符合条件的商品哦</Text>
           </View>
          </View>
        )}
        {modalVisible ? (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.border}></View>
              <View style={styles.modals}>
                <View style={styles.modals_top}>
                  <Text style={styles.screen_li1_p}>价格区间</Text>
                  <View style={styles.modals_price}>
                    <TextInput
                      style={styles.TextInput}
                      onChangeText={(text) => this.onChangeText(text)}
                      value={minimum}
                      placeholder="最低价"
                    />
                    <Text style={styles.prices_t}>—</Text>
                    <TextInput
                      style={styles.TextInput}
                      onChangeText={(text) => this.onChangehighest(text)}
                      value={highest}
                      placeholder="最高价"
                    />
                  </View>
                </View>
                <View style={[styles.label_list, styles.modals_top]}>
                  <Text style={styles.screen_li1_p}>标签</Text>
                  <View style={styles.modals_price}>
                    {label_list.map((item) => (
                      <View key={'label_list' + item.id}>
                        {!item.select ? (
                          <Text
                            style={styles.screen_li1_p1}
                            onPress={() => this.title(item)}>
                            {item.title}
                          </Text>
                        ) : (
                          <Text
                            style={styles.screen_li1_p2}
                            onPress={() => this.title(item)}>
                            {item.title}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.modal_footer}>
                <Touchable onPress={this.empty} style={styles.modal_footer1}>
                  <View>
                    <Text style={styles.text_f}>清空</Text>
                  </View>
                </Touchable>
                <Touchable
                  onPress={this.determine}
                  style={styles.modal_footer2}>
                  <View style={styles.modal_footer2}>
                    <Text style={styles.text_f1}>确定</Text>
                  </View>
                </Touchable>
              </View>
            </View>
          </View>
        ) : null}
        {
          meauListLoad ?<View><Loading /></View>: null
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: pxToDp(15),
    width: '100%',
  },
  search_style: {
    width: pxToDp(550),
    height: pxToDp(70),
  },
  searchcontent: {
    paddingHorizontal: pxToDp(40),
    marginTop: pxToDp(48),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  searchframe: {
    width: pxToDp(550),
    height: pxToDp(70),
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    display: 'flex',
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: pxToDp(20),
  },
  searchicon: {
    width: pxToDp(40),
    height: pxToDp(40),
    marginLeft: pxToDp(20),
    marginTop: pxToDp(12),
  },
  searchtext: {
    height: pxToDp(70),
    fontSize: pxToDp(28),
    marginLeft: pxToDp(20),
  },
  titletext: {
    fontSize: pxToDp(36),
    textAlign: 'center',
    marginTop: pxToDp(60),
    marginBottom: pxToDp(30),
    color: '#333',
  },
  searchbutton: {
    height: pxToDp(70),
  },
  searchwezi: {
    textAlign: 'right',
    fontSize: pxToDp(30),
    lineHeight: pxToDp(70),
  },
  backgroundColor: {
    height: pxToDp(10),
    backgroundColor: theme.baseBackgroundColor,
    width: '100%',
  },
  main: {
    position: 'relative',
  },
  logo: {
    width: pxToDp(120),
    height: pxToDp(120),
  },
  flex_price: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prices: {
    width: pxToDp(22),
    height: pxToDp(22),
  },
  title: {
    fontSize: pxToDp(30),
    marginTop: pxToDp(30),
    fontWeight: 'bold',
  },
  shop_main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: pxToDp(40),
  },
  productlist: {
    // display: 'flex',
    // flexDirection: 'row',
    // // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    // width: '100%',
  },
  productlists: {
    // display: 'flex',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },
  commodity: {
    // width: '100%',
    width: pxToDp(320),
    height: pxToDp(520),
    marginBottom: pxToDp(50),
    flex: 1,
  },
  commoditys: {
    height: pxToDp(520),
    marginBottom: pxToDp(50),
    // flex:1,
    width: '46%',
    margin: '2%',
    alignItems: 'center',
  },

  commodityimage: {
    width: '100%',
    // height: '100%',
    height: pxToDp(360),
    borderRadius: pxToDp(4),
  },
  commoditydetails: {
    height: pxToDp(160),
    marginTop: pxToDp(20),
    paddingHorizontal: pxToDp(12),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  commoditytitle: {
    height: pxToDp(50),
    fontSize: pxToDp(28),
    color: '#666',
  },
  commodityintroduce: {
    fontSize: pxToDp(24),
    color: '#999',
  },
  commodityprice: {
    fontSize: pxToDp(28),
    color: '#66bfb9',
  },
  order: {
    color: theme.baseColor,
  },
  orders: {
    color: '#000',
  },
  centeredView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    marginTop: pxToDp(230),
    zIndex: 888,
  },
  modalView: {
    width: '100%',
    // height: '40%',
    backgroundColor: '#fff',
    // paddingLeft: pxToDp(40),
    // paddingRight: pxToDp(40),
  },
  border: {
    width: '100%',
    height: pxToDp(2),
    backgroundColor: '#f2f2f2',
  },
  modals: {
    marginLeft: pxToDp(40),
    marginRight: pxToDp(40),
  },
  modals_top: {
    marginTop: pxToDp(40),
    marginBottom: pxToDp(10),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  modals_price: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 7,
  },
  TextInput: {
    backgroundColor: theme.baseBackgroundColor,
    width: pxToDp(200),
    height: pxToDp(60),
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  prices_t: {
    marginLeft: pxToDp(20),
    marginRight: pxToDp(20),
  },
  screen_li1_p1: {
    padding: pxToDp(18),
    backgroundColor: theme.baseBackgroundColor,
    marginTop: pxToDp(10),
    marginRight: pxToDp(20),
    marginBottom: pxToDp(10),
    color: '#000',
  },
  screen_li1_p2: {
    padding: pxToDp(18),
    backgroundColor: theme.baseColor,
    marginTop: pxToDp(10),
    marginRight: pxToDp(20),
    marginBottom: pxToDp(10),
    color: '#fff',
  },
  screen_li1_p: {
    // width: pxToDp(100),
    fontSize: pxToDp(24),
    // marginRight: pxToDp(20),
    flex: 2,
  },
  modal_footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: theme.baseBackgroundColor,
    borderTopWidth: pxToDp(3),
  },
  modal_footer1: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightColor: theme.baseBackgroundColor,
    borderRightWidth: pxToDp(3),
  },
  modal_footer2: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text_f: {
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(30),
  },
  text_f1: {
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(30),
    color: theme.baseColor,
  },
  none_text:{
    textAlign:'center',
    color:'#a3a8b0'
  },
  none:{
    width:pxToDp(400),
    marginTop:pxToDp(80),
    
  },
  none_main:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center'
  }
});

export default connect(({SearchModel: {...SearchModel}}) => ({SearchModel}))(
  CommodityArea,
);
