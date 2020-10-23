import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, FooterLogo, Touchable } from '../components';
import { NavigationActions, pxToDp, theme , Storage } from '../utils';


class Mine extends Component {
  static navigationOptions = {
    title: '我的',
    tabBarIcon: ({ focused, tintColor }) => {
      return (
        <Image
          style={[styles.iconTabbar, { tintColor }]}
          source={require('../images/mine.png')}
        />
      )
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      mineDate: {},
      degree: [
        {
          title: '我的订单',
          icon: require('../images/myorder.png'),
          color: 'f9cc3d',
          page: 'MyOrderPage',
          index: 1,
        },
        // {
        //   title: '我的购物车',
        //   icon: require('../images/icon_cart.png'),
        //   color: '7f9db2',
        //   page: 'ShoppingCartPage',
        //   index: 2,
        // },
        // {
        //   title: '我的关注',
        //   icon: require('../images/see.png'),
        //   color: '4dbfe2',
        //   page: 'MyAttentionPage',
        //   index: 3,
        // },
        {
          title: '我的发票',
          icon: require('../images/icon_coupon1.png'),
          color: '2ea7e0',
          page: 'MyInvoicePage',
          index: 4,
        },
        {
          title: '我的优惠券',
          icon: require('../images/icon_coupon.png'),
          color: 'fc913a',
          page: 'MyVoucherPage',
          index: 5,
        },
        {
          title: '我的礼品卡',
          icon: require('../images/icon_giftcard.png'),
          color: 'd6a8f4',
          page: 'MyGiftCardPage',
          index: 6,
        },
        {
          title: '我的反馈',
          icon: require('../images/icon_sugestion.png'),
          color: '66beb8',
          page: 'MyFeedbackPage',
          index: 7,
        },
        {
          title: '关于我们',
          icon: require('../images/aboutus.png'),
          color: '66beb8',
          page: 'MyAboutusPage',
          index: 8,
        },
      ],
    };
  }

  edit = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'EditMine' }));
  };

  //获取个人中心页面数据
  componentDidMount= async () => {
    const { app } = this.props;
    // console.log(app);
    // this.props.dispatch({
    //   type: `app/getMineDetail`,
    //   payload: {},
    //   callback: (res) => {
    //     if (res.error == 0) {
    //       // console.error(this.state.mineDate.head_img);
    //       this.setState({
    //         mineDate: res.data,
    //       });
    //       const { dispatch } = this.props;
    //       // console.log(118)
    //       dispatch({
    //         type: 'app/updateState',
    //         payload: {
    //           user: res.data
    //         }
    //       })
    //     }
    //   },
    // });
  
  }
  degree = (item) => {
    // console.log(item)
    if (item.index == 1) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Orders' }))
    }
    if (item.index == 7) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Feedback' }))
    }
    if (item.index == 6) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'GiftCard' }))
    }
    if (item.index == 8) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Aboutus' }))
    }
    if (item.index == 5) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'Mycoupon' }))
    }
    if (item.index == 4) {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'MyInvoice' }))
    }
  }
  render() {
    const {
      app: { user },
    } = this.props;
    const { mineDate, degree } = this.state;
    const Item = ({ title }) => {
      return (
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
      );
    };
    const renderItem = ({ item }) => <Item title={item.title} />;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.top}>
            <View style={styles.img}>
              {user.head_img != null ? (
                <Image
                  style={styles.portrait}
                  source={{ uri: user.head_img }}
                />
              ) : (
                  <Image
                    style={styles.portrait}
                    source={require('../images/default_avatar.jpg')}
                  />
                )}

              <View style={styles.topmain}>
                {/* <Text style={styles.name}>{mineDate.name}</Text> */}
                <Text style={styles.name}>{user.name}</Text>

                <Text style={styles.level}>{user.phone}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.edit} onPress={this.edit}>
                编辑
              </Text>
            </View>
          </View>
          {/* <View style={styles.displayFlexs}>
            <View style={styles.displayFlex}>
              <Image
                source={require('../images/line-information.png')}
                style={styles.imgstyle}
                resizeMode="contain"
              />
              <Text>分销员中心</Text>
            </View>
            <View>
              <Image
                source={require('../images/next.png')}
                style={styles.icon}
              />
            </View>
          </View> */}
          {degree.map((item) => (
            <Touchable onPress={() => this.degree(item)} key={'degree' + item.index}>
              <View
                style={[
                  styles.displayFlexs,
                  item.index == 6 ? styles.bmStyle : null,
                ]}>
                {/* <Text>{ JSON.stringify(item)}</Text> */}
                <View style={styles.displayFlex}>
                  <Image
                    source={item.icon}
                    style={styles.imgstyle}
                    resizeMode="contain"
                  />

                  <Text>{item.title}</Text>
                </View>
                <View style={styles.none}>
                  <Image
                    source={require('../images/next.png')}
                    style={styles.icon}
                  />

                </View>
              </View>
            </Touchable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.baseBackgroundColor,
  },
  displayFlex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  iconTabbar: {
    width: pxToDp(40),
    height: pxToDp(40),
  },
  top: {
    backgroundColor: '#ffffff',
    marginBottom: pxToDp(10),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: pxToDp(40),
  },
  topmain: {
    marginTop: pxToDp(16),
  },
  name: {
    fontSize: pxToDp(36),
    marginBottom: pxToDp(10),
  },
  level: {
    color: '#a3a8b0',
    fontSize: pxToDp(24),
  },
  edit: {
    color: theme.baseColor,
  },
  img: {
    flexDirection: 'row',
    display: 'flex',
  },
  displayFlexs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pxToDp(104),
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  displayFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bmStyle: {
    marginTop: pxToDp(10),
    marginBottom: pxToDp(10),
  },
  imgstyle: {
    width: pxToDp(36),
    height: 'auto',
    marginRight: pxToDp(23),
  },
  icon: {
    width: pxToDp(18),
    height: pxToDp(30),
  },
  portrait: {
    width: pxToDp(120),
    height: pxToDp(120),
    marginRight: pxToDp(30),
    borderRadius: pxToDp(60),
  },
});

export default connect(({ app: { ...app } }) => ({ app }))(Mine);
