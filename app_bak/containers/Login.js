import React, { Component } from 'react'
import { StyleSheet, View, Image, ActivityIndicator, ImageBackground, ScrollView, KeyboardAvoidingView, Alert } from 'react-native'
import { connect } from 'react-redux'

import { Container, Header, Content, Button, Text, Icon, Thumbnail } from 'native-base';
import InputField from '../components/form/InputField';
import colors from '../styles/colors';

import { createAction, NavigationActions } from '../utils'
import * as wechat from 'react-native-wechat-lib'
import Config from '../config';


class Login extends Component {
  static navigationOptions = {
    title: 'Login',
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validEmail: false,
      // mobile: '17751515920',
      // password: '1234abcd',
      mobile: '17756989411',
      password: 'xucheng1996',
      validPassword: false,
      loadingVisible: false,
    };

    //this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    //this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentWillMount() {
    // 监听键盘弹出与收回
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.props.dispatch({
      type: 'app/checkLogin',
      payload: {}
    })
  }

  //Check Email
  handleEmailChange(email) {
    // eslint-disable-next-line
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ emailAddress: email });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false });
    }
  }

  handleDevLogin() {

    const { mobile, password } = this.state;
    this.props.dispatch({ type: 'app/login', payload: { mobile, password } })
  }

  handleNextButton() {
    //this.setState({ loadingVisible: true });
    //const {navigation } = this.props;
    //const { navigate } = navigation;
    this.props.dispatch(NavigationActions.navigate({ routeName: 'LoginPass' }))
    //const { mobile, password } = this.state;
    //this.props.dispatch({ type: 'app/login', payload: { mobile, password } })

    /* setTimeout(() => {
  const { emailAddress, password } = this.state;
  if (logIn(emailAddress, password)) {
    this.setState({ formValid: true, loadingVisible: false });
    navigate('TurnOnNotifications');
  } else {
    this.setState({ formValid: false, loadingVisible: false });
  }
}, 2000);*/
  }

  handlePasswordChange(password) {
    const { validPassword } = this.state;

    this.setState({ password });
    if (password.length > 4) {
      // Password has to be at least 4 characters long
      this.setState({ validPassword: true });
    } else {
      this.setState({ validPassword: false });
    }
    // if (!validPassword) {
    //     if (password.length > 4) {
    //         // Password has to be at least 4 characters long
    //         this.setState({ validPassword: true });
    //     }
    // } else if (password <= 4) {
    //     this.setState({ validPassword: false });
    // }
  }

  toggleNextButtonState() {
    const { validEmail, validPassword } = this.state;
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }

  getAccessToken(code) {
    this.props.dispatch({ type: 'app/wxLogin', payload: { code, num: 4 } })
  }

  installWechat() {
    return
  }

  handleWeixinLogin() {
    //微信登录示例
    let scope = 'snsapi_userinfo';
    let state = 'wechat_sdk_demo';
    const that = this;
    //判断微信是否安装
    wechat.isWXAppInstalled()
      .then((isInstalled) => {
        if (isInstalled) {
          //发送授权请求
          wechat.sendAuthRequest(scope, state)
            .then(responseCode => {
              //返回code码，通过code获取access_token
              that.getAccessToken(responseCode.code);
            })
            .catch(err => {
              Alert.alert('登录授权发生错误：', err.message, [
                { text: '确定' }
              ]);
            })
        } else {
          Platform.OS == 'ios' ?
            Alert.alert('没有安装微信', '是否安装微信？', [
              { text: '取消' },
              { text: '确定', onPress: () => this.installWechat() }
            ]) :
            Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
              { text: '确定' }
            ])
        }
      })
  }



  render() {
    const { fetching } = this.props
    const {
      formValid, loadingVisible, validEmail, validPassword,
    } = this.state;
    return (
      <ImageBackground source={require('../images/background.png')} style={{ width: '100%', height: '100%' }}>
        {fetching ? (
          <View style={[styles.container]}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
            <Content padder style={[styles.content]}>
              <Button block rounded iconLeft onPress={this.handleWeixinLogin.bind(this)} style={{ backgroundColor: '#66BFB9' }}>
                <Thumbnail small source={require('../images/wx_logo.png')} />
                <Text>微信账号登录</Text>
              </Button>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.otherLogin]}>────────    其他登录方式    ────────</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Button bordered rounded block light onPress={this.handleNextButton}>
                  <Text style={{ fontSize: 14 }}>密码/短信验证码登录</Text>
                </Button>
                {Config.dev =='test'?(
                <Button bordered rounded block light onPress={this.handleDevLogin.bind(this)} style={{marginTop:20}}>
                  <Text style={{ fontSize: 14 }}>开发直接登录</Text>
                </Button>):null}
              </View>

            </Content>

          )}



      </ImageBackground>

    )
  }
}

const styles = StyleSheet.create({

  transparentHeaderStyle: {
    borderBottomWidth: 0,
    elevation: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1,
    padding: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1,
  },
  loginHeader: {
    fontSize: 30,
    color: colors.white,
    fontWeight: '300',
    marginBottom: 40,
    height: 50,
    width: '100%'
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    marginTop: 400,
  },
  otherLogin: {
    paddingTop: 20,
    paddingBottom: 20,
    color: '#cfcfcf',
    alignItems: 'center',
    fontSize: 12
  }

})

export default connect(({ app }) => ({ ...app }))(Login)
