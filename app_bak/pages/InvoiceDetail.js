import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';
import {connect} from 'react-redux';

// import {Button} from '../components';

import { pxToDp, theme} from '../utils';

class InvoiceDetail extends Component {
  static navigationOptions = {
    title: '发票详情',
  };
  constructor(props) {
    super(props);
    this.state = {
      mineDate: [],
    };
  }
  //获取数据
  componentDidMount = async () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: {id},
        },
      },
    } = this.props;
    this.props.dispatch({
      type: `Mine/invoice_detail`,
      payload: {
        id,
      },
      callback: (res) => {
        // console.log(res);
        if (res.error == 0) {
          this.setState({
            mineDate: res.data,
          });
          console.log(this.state.mineDate);
        }
      },
    });
  };

  render() {
    const {mineDate} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            {mineDate.invoice_status == 0 ? (
              <View style={[styles.top]}>
                <Text style={styles.top_title}>
                  开票中，您的开票申请正在审核
                </Text>
              </View>
            ) : null}
            <View style={styles.main}>
              <View style={styles.main_top}>
                <Text style={styles.title1}>票据信息</Text>
                {mineDate.invoice_status == 0 ? (
                  <Text style={styles.title2}>开票中</Text>
                ) : (
                  <Text style={styles.title2}>已开票</Text>
                )}
              </View>
              {mineDate.code != null ? (
                <View style={styles.main_list}>
                  <Text style={styles.text_s}>票据编号</Text>
                  <Text style={styles.text_s2}>{mineDate.code}</Text>
                </View>
              ) : null}
              <View style={styles.main_list}>
                <Text style={styles.text_s}>发票类型</Text>
                {mineDate.invoice_type == 0 ? (
                  <Text style={styles.text_s2}>电子发票</Text>
                ) : (
                  <Text style={styles.text_s2}>纸质发票</Text>
                )}
              </View>
              <View style={styles.main_list}>
                <Text style={styles.text_s}>发票抬头</Text>
                {mineDate.invoice_body == 0 ? (
                  <Text style={styles.text_s2}>个人</Text>
                ) : (
                  <Text style={styles.text_s2}>企业</Text>
                )}
              </View>
              <View style={styles.main_list}>
                <Text></Text>
                <Text style={styles.text_s2}>{mineDate.invoice_client}</Text>
              </View>
              <View style={styles.main_list}>
                <Text style={styles.text_s}>收货人手机号</Text>
                <Text style={styles.text_s2}>{mineDate.phone}</Text>
              </View>
              {mineDate.invoice_type == 0 ? (
                <View style={styles.main_list}>
                  <Text style={styles.text_s}>收货人邮箱</Text>
                  <Text style={styles.text_s2}>{mineDate.email}</Text>
                </View>
              ) : null}
              {mineDate.invoice_body == 1 ? (
                <View style={styles.main_list}>
                  <Text style={styles.text_s}>企业识别号</Text>
                  <Text style={styles.text_s2}>{mineDate.number}</Text>
                </View>
              ) : null}
              {mineDate.invoice_type == 1 ? (
                <View style={styles.main_list}>
                  <Text style={styles.text_s}>收货地址</Text>
                  <Text style={styles.text_s2}>{mineDate.address}</Text>
                </View>
              ) : null}
              {mineDate.invoice_type == 1 ? (
                <View style={styles.main_list}>
                  <Text style={styles.text_s}>邮编</Text>
                  <Text style={styles.text_s2}>{mineDate.postcode}</Text>
                </View>
              ) : null}
              <View style={styles.main_list}>
                <Text style={styles.text_s}>发票内容</Text>
                <Text style={styles.text_s2}>{mineDate.content}</Text>
              </View>
              <View style={styles.main_list}>
                <Text style={styles.text_s}>发票金额</Text>
                <Text style={styles.text_s2}>{mineDate.amount}</Text>
              </View>
            </View>
            {mineDate.invoice_type == 1 ? (
              <View>
                <View style={styles.baseBackgroundColor}></View>
                <View style={styles.invoice_type}>
                  <View style={styles.main_top}>
                    <Text style={styles.title1}>物流信息</Text>
                    <Text style={styles.title2}></Text>
                  </View>
                  <View style={styles.main_list}>
                    <Text style={styles.text_s}>物流公司</Text>
                    <Text style={styles.text_s2}>{mineDate.express_code}</Text>
                  </View>
                  <View style={styles.main_list}>
                    <Text style={styles.text_s}>快递单号</Text>
                    <Text style={styles.text_s2}>{mineDate.express}</Text>
                  </View>
                </View>
              </View>
            ) : null}
            <View style={styles.baseBackgroundColor}></View>
            <View style={styles.footer}>
              <View style={styles.main_top}>
                <Text style={styles.title1}>开票项目</Text>
                <Text style={styles.title2}>合计：{mineDate.amount}元</Text>
              </View>
              <View>
                {mineDate?.orders?.map((item) => (
                  <View style={styles.orders_list} key={'orders_list' + item.id}>
                    <Text
                      style={styles.product_name}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.product[0].product_name}
                    </Text>
                    <Text style={styles.need_pay}>{item.need_pay}元</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.baseBackgroundColor,
    backgroundColor: '#fff',
  },
  top: {
    backgroundColor: theme.baseColor,
  },
  top_title: {
    fontSize: pxToDp(30),
    paddingTop: pxToDp(16),
    paddingBottom: pxToDp(16),
    textAlign: 'center',
    color: '#fff',
  },
  main: {
    paddingBottom: pxToDp(20),
    paddingTop: pxToDp(40),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  main_top: {
    marginBottom: pxToDp(30),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title1: {
    fontSize: pxToDp(30),
    fontWeight: 'bold',
  },
  title2: {
    fontSize: pxToDp(30),
    color: theme.baseColor,
  },
  main_list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.baseBackgroundColor,
    marginBottom: pxToDp(20),
    padding: pxToDp(30),
  },
  text_s: {
    color: '#a3a8b0',
  },
  text_s2: {
    fontSize: pxToDp(30),
  },
  baseBackgroundColor: {
    backgroundColor: theme.baseBackgroundColor,
    height: pxToDp(10),
  },
  footer: {
    padding: pxToDp(40),
  },
  orders_list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  product_name: {
    width: '70%',
    fontSize: pxToDp(30),
  },
  need_pay: {
    fontSize: pxToDp(30),
  },
  invoice_type: {
    padding: pxToDp(40),
  },
});

export default connect(({Mine: {...Mine}}) => ({Mine}))(InvoiceDetail);
