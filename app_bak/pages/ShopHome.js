import React, { Component, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  Text,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { Touchable } from '../components';

import { NavigationActions, pxToDp, theme } from '../utils';

class ShopHome extends Component {
  static navigationOptions = {
    title: '店铺主页',
  };
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      logo: '',
      order: 1, //1综合 5销量 3价格倒叙 2价格正序 4上新
      page: 1,
      shopList: [],
      selectedId: true,
      status: true,
      id: ''
    };
  }

  //获取商铺数据
  componentDidMount = async () => {
    const { dispatch, navigation: { state: { params: { id } } } } = this.props;
    this.setState({
      id: id
    })
    this.props.dispatch({
      type: `SearchModel/get_shop`,
      payload: {
        id
      },
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            logo: res.data.logo,
            title: res.data.title,
          });
        }
      },
    });

    this.shop_list();
  };
  shop_list = () => {
    const { dispatch, navigation: { state: { params: { id } } } } = this.props;
    this.setState({
      id: id
    })
    this.props.dispatch({
      type: `SearchModel/get_list`,
      payload: {
        shop_id: id,
        order: this.state.order,
        page: this.state.page,
        pageSize: 8,
      },
      callback: (res) => {
        if (res.error == 0) {

          this.setState({
            shopList: res.data,
          });

          // console.log(res.data);
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
        status:true,
      },
      () => {
        this.shop_list();
        this.list.scrollToIndex({ viewPosition: 0, index: 0 });
      },
    );
  };
  // 销量
  volume = () => {
    this.setState(
      {
        order: 5,
        page: 1,
        status:true,
      },
      () => {
        this.shop_list();
        this.list.scrollToIndex({ viewPosition: 0, index: 0 });
      },
    );
  };
  // 上新
  new = () => {
    this.setState(
      {
        order: 4,
        page: 1,
        status:true,
      },
      () => {
        this.list.scrollToIndex({ viewPosition: 0, index: 0 });
        this.shop_list();
      },
    );
  };

  // 点击价格
  price = () => {
    this.setState({
      order: 2,
      page: 1,
      status:true,
    }, () => {
      this.list.scrollToIndex({ viewPosition: 0, index: 0 });
      this.shop_list();
    });
  };

  // 点击正序
  price_pull = () => {
    this.setState({
      order: 3,
      page: 1,
      status:true,
    }, () => {
      this.list.scrollToIndex({ viewPosition: 0, index: 0 });
      this.shop_list();
    });
  };
  // 点击倒序
  price_push = () => {
    this.setState({
      order: 2,
      page: 1,
      status:true,

    }, () => {
      this.list.scrollToIndex({ viewPosition: 0, index: 0 });
      this.shop_list();
    });
  }



  onEndReached = () => {
    console.log("9999")
    if (this.state.status == true) {
      const { dispatch, navigation: { state: { params: { id } } } } = this.props;
      let a = this.state.page + 1;
      this.setState(
        {
          page: a,
          id: id
        },
        () => {
          this.props.dispatch({
            type: `SearchModel/get_list`,
            payload: {
              shop_id: id,
              order: this.state.order,
              page: this.state.page,
              pageSize: 8,
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
    console.log(item)
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item }));
  }

  renderItem = ({ item }) => {
    return (

      <View style={styles.commoditys}>
        {this.state.shopList.length > 0 ? (
           <Touchable onPress={() => this.record(item)}>
          <View style={styles.productlists}>
      
             
            <View style={styles.commodity}>
              <Image
                style={styles.commodityimage}
                source={{
                  uri: item.thumb,
                }}
               ></Image>
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
      
            </View>
          </Touchable>


        ) : (
            <View></View>
          )}
      </View>
    );
  };

  render() {
    const { logo, title, shopList, order, selectedId } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {/* //   <ScrollView> */}
        <View style={styles.top}>
          <View>
            <Image style={styles.logo} source={{ uri: logo }} />
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
        <View style={styles.backgroundColor}></View>

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
              {order == 4 ? (
                <Text style={styles.order}>上新</Text>
              ) : (
                  <Text style={styles.orders} onPress={this.new}>
                    上新
                  </Text>
                )}
            </View>
          </View>
        </View>
        {/* // </ScrollView> */}
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
    justifyContent: 'center',
    paddingRight: pxToDp(40),
    paddingLeft: pxToDp(40),
    paddingTop: pxToDp(25),
    paddingBottom: pxToDp(25),
  },
  backgroundColor: {
    height: pxToDp(10),
    backgroundColor: theme.baseBackgroundColor,
    width: '100%',
  },
  main: {},
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
    justifyContent: 'space-between',
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
    margin:'2%',
    alignItems: 'center',
    // marginLeft: '2%',
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
});

export default connect(({ SearchModel: { ...SearchModel } }) => ({ SearchModel }))(
  ShopHome,
);
