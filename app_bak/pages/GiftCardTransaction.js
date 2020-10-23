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

import {Touchable} from '../components';

import {NavigationActions, pxToDp, theme} from '../utils';

class GiftCardTransaction extends Component {
  static navigationOptions = {
    title: '礼品卡交易记录',
  };
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }
  //获取页面数据
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: `Mine/getTransaction`,
      payload: {},
      callback: (res) => {
        console.log(res);
        if (res.error == 0) {
          this.setState({
            list: res.data,
          });
        
        }
      },
    });
  }
//   点击去订单
  exchange = (item)=>{
      console.log(item.target_id)
      const { dispatch } = this.props;
      let id = item.target_id
    dispatch(NavigationActions.navigate({ routeName: 'Orderdetails', params: {id} }));
  }

  render() {
    const {list} = this.state;
    return (
      <SafeAreaView style={[list.length > 0 ? styles.container : styles.containers]}>
        <ScrollView>
          <View>
            {list.length > 0 ? (
              <View>
                {list.map((item) => (
                  <Touchable onPress={() => this.exchange(item)} key={'list_exchange' + item.id}>
                    <View style={styles.list}>
                      <View style={styles.list_top}>
                        {item.type == 1 ? (
                          <Text style={styles.buy}>商城购买</Text>
                        ) : null}
                        {item.type == 2 ? (
                          <Text style={styles.buy}>福德计划</Text>
                        ) : null}
                        <Text style={styles.buy}>{item.money}元</Text>
                      </View>
                      <View style={styles.list_tops}>
                        <Text style={styles.created_at}>{item.created_at}</Text>
                        <Text style={styles.see}>查看订单</Text>
                      </View>
                    </View>
                  </Touchable>
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
  list: {
    backgroundColor: '#fff',
    marginBottom: pxToDp(10),
    padding: pxToDp(40),
  },
  test: {
    height: pxToDp(80),
    backgroundColor: theme.colorEc6025,
    justifyContent: 'center',
    alignItems: 'center',
  },
  test_text: {
    fontSize: pxToDp(50),
  },
  list_top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pxToDp(30),
  },
  list_tops: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buy: {
    fontSize: pxToDp(30),
  },
  created_at: {
    color: '#a3a8b0',
    fontSize: pxToDp(24),
  },
  see: {
    color: theme.baseColor,
    fontSize: pxToDp(24),
  },
});

export default connect(({Mine: {...Mine}}) => ({Mine}))(GiftCardTransaction);
