import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-tiny-toast';

import {NavigationActions, pxToDp, theme} from '../utils';

class ModifyPhone extends Component {
  static navigationOptions = {
    title: '绑定手机号',
  };
  constructor(props) {
    super(props);
    this.state = {
      mineDate: {},
      phone: '',
      value: '',
      btnValue: '获取验证码',
      count: 60,
      visible: false,
    };
  }

  //获取个人中心页面数据
  componentDidMount() {
    this.props.dispatch({
      type: `app/getMineDetail`,
      payload: {},
      callback: (res) => {
        console.error('iiii');
        if (res.error == 0) {
          console.error(this.state.mineDate.head_img);
          this.setState({
            mineDate: res.data,
            phone: res.data.phone,
          });
          const {dispatch} = this.props;
          console.log(118);
          dispatch({
            type: 'app/updateState',
            payload: {
              user: res.data,
            },
          });
        }
      },
    });
  }
  //   验证码
  onChangeText = (a) => {
    if (a.length <= 5) {
      this.setState({
        value: a,
      });
    }
  };

  //   倒计时
  count = () => {
    const {count} = this.state;
    if (count === 1) {
      this.setState({
        count: 60,
        btnValue: '获取验证码',
      });
    } else {
      this.setState({
        count: count - 1,
        btnValue: count + 's',
      });
      setTimeout(this.count.bind(this), 1000);
    }
  };
  //   发送验证码
  verify_code = () => {
    this.count();
    this.setState({
      count: 60,
    });
    this.props.dispatch({
      type: `app/verify_code`,
      payload: {
        mobile: this.state.phone,
      },
      callback: (res) => {
        console.error(res);
        console.error('888');
        Toast.show(res.message, {
          position: 0,
          duration: 2000,
        });

        if (res.error == 0) {
        }
      },
    });
  };
  //   下一步
  check_mobile = () => {
    // console.error(this.state.phone)
    // console.error(this.state.value)
    this.props.dispatch({
      type: `app/check_mobile`,
      payload: {
        mobile: this.state.phone,
        verifyCode: this.state.value,
      },
      callback: (res) => {
        Toast.show(res.errmsg, {
          position: 0,
          duration: 2000,
        });

        if (res.error == 0) {
        this.props.dispatch(
          NavigationActions.navigate({routeName: 'EditPhone'}),
        );
        }
      },
    });
  };

  render() {
    const {phone, value, btnValue} = this.state;
    const {
      app: {user},
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            <View style={styles.phone}>
              <View style={styles.phone_one}>
                <Text style={styles.text}>原手机号</Text>
              </View>
              <View style={styles.phone_t}>
                {user.phone != null ? (
                  <Text style={styles.text}>
                    {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </Text>
                ) : (
                  <Text></Text>
                )}
              </View>
            </View>
            <View style={styles.phone}>
              <View style={styles.phone_one}>
                <Text>验证码</Text>
              </View>
              <View style={styles.phone_two}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.onChangeText(text)}
                  value={value}
                />
                <Text style={styles.btnValue} onPress={this.verify_code}>
                  {btnValue}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.footer}>
            {value.length == 5 ? (
              <Text style={styles.next} onPress={this.check_mobile}>
                下一步
              </Text>
            ) : (
              <Text style={styles.next_op}>下一步</Text>
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
  },
  phone: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: pxToDp(40),
  },
  phone_one: {
    flex: 4,
  },
  phone_t: {
    flex: 8,
  },
  text: {
    fontSize: pxToDp(30),
    color: '#000',
  },
  phone_two: {
    flex: 8,
    backgroundColor: theme.baseBackgroundColor,
    height: pxToDp(80),
    position: 'relative',
  },
  btnValue: {
    height: pxToDp(80),
    position: 'absolute',
    right: pxToDp(10),
    top: '50%',
    marginTop: pxToDp(-16),
    color: theme.baseColor,
    fontSize: pxToDp(24),
    width: pxToDp(160),
    height: pxToDp(54),
    zIndex: 999,
    textAlign: 'right',
  },
  input: {
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
    paddingTop:pxToDp(20),
    paddingBottom:pxToDp(20),
    width:'100%',
  },
  next: {
    width: '58.66667%',
    height: pxToDp(98),
    backgroundColor: theme.baseColor,
    textAlign: 'center',
    lineHeight: pxToDp(98),
    color: '#f7f8fa',
    fontSize: pxToDp(30),
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: pxToDp(106),
  },
  next_op: {
    width: '58.66667%',
    height: pxToDp(98),
    backgroundColor: theme.baseColor,
    textAlign: 'center',
    lineHeight: pxToDp(98),
    color: '#f7f8fa',
    fontSize: pxToDp(30),
    opacity: pxToDp(0.8),
  },
});

export default connect(({app: {...app}}) => ({app}))(ModifyPhone);
