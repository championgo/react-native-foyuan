import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';
import {connect} from 'react-redux';

import { Touchable} from '../components';

import {NavigationActions, pxToDp, theme} from '../utils';

class GiftCard extends Component {
  static navigationOptions = {
    title: '礼品卡',
  };
  constructor(props) {
    super(props);
    this.state = {
      price: '',
      giftList: [],
    };
  }

  //获取页面数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `Mine/giftcard`,
      payload: {},
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            price: res.data,
          });
          dispatch({
            type: 'Mine/updateState',
            payload: {
                prices: res.data
            }
          })
        }
      },
    });
   dispatch({
      type: `Mine/getExchange`,
      payload: {},
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            giftList: res.data,
          });
          dispatch({
            type: 'Mine/updateState',
            payload: {
                giftLists: res.data
            }
          })
          
        }
      },
    });
  }
//   兑换
exchange =()=>{
    this.props.dispatch(NavigationActions.navigate({routeName: 'GiftCardExchange'}));
}
// 交易记录
record =()=>{
  this.props.dispatch(NavigationActions.navigate({routeName: 'GiftCardTransaction'}));
}

  render() {
    const {
        Mine: {prices , giftLists}
      } = this.props;
    const {price, giftList} = this.state;
    return (
      <SafeAreaView style={[giftLists.length > 0 ? styles.container : styles.containers]}>
        <ScrollView>
          <View style={styles.header}>
            <Touchable onPress={() => this.record()}>
            <View style={styles.header1}>
              <Text style={styles.text}>交易记录</Text>
            </View>
            </Touchable>
            <View style={styles.heade_main}>
              <Text style={styles.heade2}>礼品卡余额</Text>
            </View>
            <View style={styles.heade_main}>
              <Text style={styles.header3}>{prices}元</Text>
            </View>
            <Touchable onPress={() => this.exchange()}>
              <View style={styles.heade_mains}>
                <Text style={styles.header4}>兑换</Text>
              </View>
            </Touchable>
          </View>
          <View>
            {giftLists.length > 0 ? (
              <View>
                {giftLists.map((item) => (
                  <View style={styles.list_top} key={'giftLists' + item.card_id}>
                    <View
                      style={[
                        item.card_status == 1 || item.card_status == 3
                          ? styles.body_list_tops
                          : styles.body_list_top,
                      ]}>
                      {item.card_status == 1 || item.card_status == 3 ? (
                        <View>
                          <Image
                            source={require('../images/gift_card.png')}
                            style={styles.icon}
                          />
                        </View>
                      ) : (
                        <View></View>
                      )}
                      {item.giftcard.batch.type == 1 ? (
                        <View>
                          <Text style={styles.type}>电子卡</Text>
                        </View>
                      ) : (
                        <View></View>
                      )}
                      {item.giftcard.batch.type == 2 ? (
                        <View>
                          <Text style={styles.type}>实体卡</Text>
                        </View>
                      ) : (
                        <View></View>
                      )}

                      <View style={styles.remain_money}>
                        <Text style={styles.money_text1}>余额</Text>
                        <Text style={styles.money_text2}>
                          {item.remain_money}元
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.cardnumber}>
                          卡号：{item.giftcard.cardnumber}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bottom}>
                      <Text style={styles.endtime}>
                        有效期截止到：{item.endtime}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.foot}>
               <View>
                <Image
                  style={styles.searchicon}
                  source={require('../images/illustration_coupon.png')}></Image>
                  <Text style={styles.foot_test}>您还没有任何兑换记录哦</Text>
               </View>
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
    backgroundColor: theme.baseBackgroundColor,
  },
  containers: {
    flex: 1,
    backgroundColor: "#fff",
  },
  foot:{
    width:'100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'center',
    backgroundColor:"#fff",
    marginTop:pxToDp(100),
  },
  searchicon:{
    width:pxToDp(360),
    height:pxToDp(150),
    marginBottom:pxToDp(20),
  },
  foot_test:{
    textAlign:'center',
    color:'#a3a8b0'
  },
  header: {
    backgroundColor: theme.baseColor,
    width: '100%',
    padding: pxToDp(40),
  },
  header1: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: pxToDp(30),
  },
  text: {
    color: '#fff',
    fontSize: pxToDp(30),
  },
  heade_main: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: pxToDp(30),
  },
  heade_mains: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: pxToDp(30),
  },
  header4: {
    borderColor: '#fff',
    borderWidth: 1,
    width: pxToDp(110),
    textAlign: 'center',
    height: pxToDp(50),
    lineHeight: pxToDp(50),
    color: '#fff',
    borderRadius: pxToDp(4),
  },
  heade2: {
    opacity: 0.5,
    color: '#fff',
    fontSize: pxToDp(30),
  },
  header3: {
    fontSize: pxToDp(60),
    color: '#fff',
  },
  list_top: {
    marginTop: pxToDp(30),
    marginLeft: pxToDp(40),
    marginRight: pxToDp(40),
    position: 'relative',
  },
  body_list_top: {
    backgroundColor: 'rgb(255, 130, 110)',
    padding: pxToDp(30),
    borderTopLeftRadius: pxToDp(10),
    borderTopRightRadius: pxToDp(10),
  },
  body_list_tops: {
    backgroundColor: 'rgb(163, 168, 176)',
    padding: pxToDp(30),
    borderTopLeftRadius: pxToDp(10),
    borderTopRightRadius: pxToDp(10),
  },
  icon: {
    position: 'absolute',
    width: pxToDp(120),
    height: pxToDp(110),
    right: 0,
    top: 0,
    zIndex: -1,
  },
  bottom: {
    padding: pxToDp(30),
    backgroundColor: '#fff',
    borderBottomLeftRadius: pxToDp(10),
    borderBottomRightRadius: pxToDp(10),
  },
  endtime: {
    fontSize: pxToDp(24),
    color: '#a3a8b0',
  },
  type: {
    fontSize: pxToDp(30),
    color: '#fff',
  },
  remain_money: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  money_text1: {
    fontSize: pxToDp(24),
    color: '#fff',
  },
  money_text2: {
    fontSize: pxToDp(30),
    color: '#fff',
    marginLeft: pxToDp(25),
  },
  cardnumber: {
    color: '#fff',
    fontSize: pxToDp(24),
  },
});

export default connect(({Mine: {...Mine}}) => ({Mine}))(GiftCard);
