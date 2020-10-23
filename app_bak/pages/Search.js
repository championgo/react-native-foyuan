import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { Touchable } from '../components';

import { NavigationActions, pxToDp, theme, Storage } from '../utils';

class Search extends Component {
  static navigationOptions = {
    title: '搜索',
  };
  constructor(props) {
    super(props);
    this.state = {
      mineDate: [],
      value: '',
      shopList: [],
      nume: true,
      arr: [],
    };
  }

  //获取个人数据
  componentDidMount = async () => {
    this.props.dispatch({
      type: `SearchModel/hotKeyWord`,
      payload: {},
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            mineDate: res.data,
          });
          console.log(this.state.mineDate,"mineDate")
        }
      },
    });
    if (JSON.stringify(await Storage.get('search')) != '{}') {
      this.setState({
        arr: Array.from(await Storage.get('search')),
      });
      console.log(this.state.arr,"arr")

    }
  };
  //   搜索框
  onChangeText = (a) => {
    this.setState({
      value: a,
    });
  };

  //
  search = async () => {
    let h = this.state.arr;
    console.log('0000');
    // console.log(await Storage.get('search'));

    if (h.indexOf(this.state.value) == -1) {
      h.push(this.state.value);
      this.setState({
        arr: h,
      });
      //存储
      Storage.set('search', h);
    }

    const { dispatch } = this.props;

    dispatch({
      type: `SearchModel/search_index`,
      payload: {
        name: this.state.value,
        limit: '50',
        page: '1',
      },
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            shopList: res.data.product,
            nume: false,
          });
          console.log(res.data.product,"product");
        }
      },
    });
  };
  // 删除历史记录
  delete = () => {
    console.log('88');
    Storage.remove('search');
    this.setState({
      arr: [],
    });
  };
  keyword = (item) => {
    console.log(item.keyword);
    this.setState({
      value: item.keyword,
    });
  };
  host = (item) => {
    console.log(item);
    this.setState({
      value: item,
    });
  };
  // 去详情页面
  shopList_but = (item) => {
    console.log(item.skus)
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName: 'CommodityDetail', params: item.skus[0] }));
  }

  render() {
    const { mineDate, value, nume, shopList, arr } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.top}>
            <View style={styles.searchframe}>
              <Image
                style={styles.searchicon}
                source={require('../images/search.png')}></Image>
              <View style={{flex:1}}>
                <TextInput
                  style={styles.searchtext}
                  onChangeText={(text) => this.onChangeText(text)}
                  value={value}
                  placeholder="搜索商品，如腐乳等"
                />
              </View>
            </View>
            <View style={styles.search}>
              <Text style={styles.search_text} onPress={this.search}>
                搜索
              </Text>
            </View>
          </View>
          <View style={styles.backgroundColor}></View>

          <View style={styles.main}>
            {nume == true ? (
              <View>
                {arr.length > 0 ? (
                  <View>
                    <View style={styles.delete}>
                      <Text style={styles.host}>历史纪录</Text>
                      <Touchable onPress={this.delete}>
                        <Image
                          style={styles.icon_delete}
                          source={require('../images/icon_delete.png')}></Image>
                      </Touchable>
                    </View>
                    <View style={styles.host_top}>
                      {arr.map((item , index) => (
                        <View style={styles.host_text} key={'arrText' + index}>
                          <Text onPress={() => this.host(item)}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                    <View></View>
                  )}

                <View>
                  <Text style={styles.host}>推荐搜索</Text>
                  <View style={styles.host_top}>
                    {mineDate.map((item) => (
                      <View style={styles.host_text} key={'hostText' + item.id}>
                        <Text onPress={() => this.keyword(item)}>
                          {item.keyword}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
                <View>
                  {shopList.length > 0 ? (
                    <View style={styles.productlist}>
                      {shopList.map((item) => (
                        <Touchable onPress={() => this.shopList_but(item)} style={styles.commodity} key={'shopList' + item.id}>
                          <View>
                            <Image
                              style={styles.commodityimage}
                              source={{
                                uri: item.skus[0].thumb,
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
                              <Text style={styles.commodityprice}>
                                ￥{item.skus[0].price}
                              </Text>
                            </View>
                          </View>
                        </Touchable>
                      ))}
                    </View>
                  ) : (
                      <View style={styles.none}>
                        <View>
                          <Image
                            source={require('../images/none.png')}
                            style={styles.icon}
                          />
                          <Text style={styles.none_text}>
                            找不到符合条件的商品哦
                      </Text>
                        </View>
                      </View>
                    )}
                </View>
              )}
          </View>
        </ScrollView>
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
  icon_delete: {
    width: pxToDp(20),
    height: pxToDp(20),
  },
  delete: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingRight: pxToDp(40),
    paddingLeft: pxToDp(40),
    paddingTop: pxToDp(25),
    paddingBottom: pxToDp(55),
  },
  backgroundColor: {
    height: pxToDp(10),
    backgroundColor: theme.baseBackgroundColor,
    width: '100%',
  },
  searchframe: {
    width: '87%',
    height: pxToDp(70),
    // marginTop: pxToDp(48),
    backgroundColor: theme.baseBackgroundColor,
    display: 'flex',
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchicon: {
    width: pxToDp(40),
    height: pxToDp(40),
    marginLeft: pxToDp(20),
  },
  searchtext: {
    fontSize: pxToDp(28),
    marginLeft: pxToDp(20),
    color: '#a3a8b0',
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20),
    // width:'100%',
    flexGrow: 1
    // height:pxToDp(28),
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // lineHeight: pxToDp(70),
    // marginTop: pxToDp(48),
  },
  search_text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: pxToDp(70),
    lineHeight: pxToDp(70),
    fontSize: pxToDp(28),
  },
  main: {
    paddingBottom: pxToDp(20),
    paddingTop: pxToDp(60),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  host: {
    fontSize: pxToDp(28),
    color: '#000',
  },
  host_text: {
    marginTop: pxToDp(30),
    marginBottom: pxToDp(30),
    marginRight: pxToDp(20),
    padding: pxToDp(20),
    backgroundColor: '#f1f3f6',
  },
  host_top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  productlist: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  commodity: {
    width: '45%',
    height: pxToDp(520),
    marginBottom: 10,
  },
  commodityimage: {
    width: '100%',
    height: pxToDp(300),
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
  icon: {
    width: pxToDp(340),
    height: pxToDp(154),
    marginTop: pxToDp(40),
    margin: 'auto',
  },
  none: {
    margin: 'auto',
    textAlign: 'center',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  none_text: {
    width: '100%',
    color: '#a3a8b0',
  },
});

export default connect(({ SearchModel: { ...SearchModel } }) => ({ SearchModel }))(
  Search,
);
