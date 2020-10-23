import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-tiny-toast';

// import {Button} from '../components';

import {NavigationActions, pxToDp, theme} from '../utils';

class EditPhone extends Component {
  static navigationOptions = {
    title: '修改手机',
  };

  state = {
    mineDate: {},
    phone: '',
    value: '',
    btnValue: '获取验证码',
    count: 60,
    visible: false,
    phones: '',
    Tips: '',
    button: false,
  };
  

  //获取个人中心页面数据
  componentDidMount() {
    this.props.dispatch({
      type: `app/getMineDetail`,
      payload: {},
      callback: (res) => {
        if (res.error == 0) {
          this.setState({
            mineDate: res.data,
            phone: res.data.phone,
          });
          const {dispatch} = this.props;
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
  //   输入手机号
  onChangeinput = (a) => {
    if (a.length <= 11) {
      this.setState(
        {
          phones: a,
        },
        () => {
          let c = this.state.phones;
          let Reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if (!Reg.test(c)) {
            this.setState({
              Tips: '手机号码格式错误！',
              button: false,
            });
          } else {
            this.setState(
              {
                Tips: '',
                button: true,
                // phone: e.detail.value,
              },
              () => {
                // this.setData({input:1})
              },
            );
          }
        },
      );
    }
  };

  //   验证码
  onChangeText = (a) => {
    if (a.length <= 5) {
      this.setState({
        value: a,
      });
      if (a.length == 5) {
        this.setState({
          button: true,
        });
      } else {
        this.setState({
          button: false,
        });
      }
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
    console.error(this.state.phones);
    let c = this.state.phones;
    let Reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!Reg.test(c)) {
      Toast.show('请输入正确的手机号码', {
        position: 0,
        duration: 2000,
      });
    } else {
      this.props.dispatch({
        type: `app/check_has_mobile`,
        payload: {
          mobile: this.state.phones,
        },
        callback: (res) => {
          console.error(res);
          if (res.data == true) {
            Toast.show('用户已存在', {
              position: 0,
              duration: 2000,
            });
          } else {
            this.count();
            this.setState({
                count: 60,
              });
              
              this.props.dispatch({
                type: `app/check_phone`,
                payload: {
                    mobile:this.state.phones,
                },
                callback: (res) => {
                    console.error(res)
                },
              });
          }
        },
      });
    }
  };
  //   确定
  check_mobile = () => {
    const {dispatch} = this.props;

   dispatch({
      type: `app/bindPhone`,
      payload: {
        mobile: this.state.phones,
        verifyCode: this.state.value,
        port: 1,
      },
      callback: (res) => {
       console.error(res)
        if (res.error == 0) {
        //    console.log(error)
            dispatch({
              type: 'app/updateState',
              payload: {
                user: res.data.user,
              },
            });
           dispatch(NavigationActions.navigate({ routeName: 'EditMine' }))
        }
      },
    });
  };

  render() {
    const {phone, value, btnValue, phones, Tips, button} = this.state;
    const {
      app: {user},
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            <View style={styles.phone}>
              <View style={styles.phone_one}>
                <Text style={styles.text}>手机号</Text>
              </View>
              <View style={styles.phone_two}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.onChangeinput(text)}
                  value={phones}
                />
              </View>
            </View>
            {Tips != '' ? (
              <Text style={styles.text_true}>{Tips}</Text>
            ) : (
              <Text style={styles.text_empty}></Text>
            )}

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
            {button ? (
              <Text style={styles.next} onPress={this.check_mobile}>
                确定
              </Text>
            ) : (
              <Text style={styles.next_op}>确定</Text>
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
    display:"flex",
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20),
    width:"100%",
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
  text_empty: {
    height: 0,
  },
  text_true: {
    marginLeft: pxToDp(30),
    paddingLeft: pxToDp(30),
    fontSize: pxToDp(24),
    color: theme.baseColor,
  },
});

export default connect(({app: {...app}}) => ({app}))(EditPhone);
