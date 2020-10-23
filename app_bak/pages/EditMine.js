import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  Alert,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import {TextInput} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Config from '../config/index';
import {
  NavigationActions,
  pxToDp,
  theme,
  createAction,
  Storage,
} from '../utils';
// import {BottomTabBar} from 'react-navigation-tabs';
// import {transform} from 'lodash';
import Toast from 'react-native-tiny-toast';
import {Touchable} from '../components';
import * as wechat from 'react-native-wechat-lib';
const options = {
  title: 'Select Avatar',
  customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class EditMine extends Component {
  static navigationOptions = {
    title: '编辑资料',
  };
  constructor(props) {
    super(props);
    this.state = {
      mineDate: {},
      modalVisible: false,
      value: '',
      name: '',
    };
  }

  //获取个人数据
  componentDidMount() {
    this.props.dispatch({
      type: `app/getMineDetail`,
      payload: {},
      callback: (res) => {
        // console.error(res);
        if (res.error == 0) {
          this.setState({
            mineDate: res.data,
            name: res.data.name,
            img: res.data.head_img,
          });
          const {dispatch} = this.props;
          // console.log(118)
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
  //   弹窗
  setModalVisible = (a) => {
    this.setState({
      modalVisible: a,
    });
  };
  //   修改名字a
  onChangeText = (a) => {
    this.setState({
      value: a,
    });
  };
  cancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  determine = () => {
    this.setState({
      modalVisible: false,
      name: this.state.value,
    });
    const {dispatch} = this.props;

    this.props.dispatch({
      type: `app/changename`,
      payload: {
        nickname: this.state.value,
      },
      callback: (res) => {
        // console.log(res)
        if (res.error == 0) {
          this.setState({
            mineDate: res.data,
          });
          dispatch({
            type: 'app/updateState',
            payload: {
              user: res.data,
            },
          });
        }
      },
    });
  };
  //   修改头像
  handleButtonPress = () => {
    const {dispatch} = this.props;
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then((image) => {
      Toast.show('上传图片中', {
        position: 0,
        duration: 1000,
      });
      let image_h = 'data:image/png;base64,' + image.data;
      dispatch({
        type: `app/changeimg`,
        payload: {
          image: image_h,
        },
        callback: (res) => {
          // console.error('http://wwyx.oss-cn-shanghai.aliyuncs.com/' + res.data);
          if (res.error == 0) {
            dispatch({
              type: `app/update_avatar`,
              payload: {
                head_img: Config.apicommodity + res.data,
              },
              callback: (res) => {
                if (res.error == 0) {
                  // this.setState({
                  //   img: res.data.head_img,
                  // });
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
        },
      });
    });
  };

  // 修改手机号
  ModifyPhone = (a) => {
    const {
      app: {user},
    } = this.props;
    if (user.phone == '' || user.phone == null) {
      this.props.dispatch(NavigationActions.navigate({routeName: 'EditPhone'}));
    } else {
      this.props.dispatch(
        NavigationActions.navigate({routeName: 'ModifyPhone'}),
      );
    }
  };
  // 收货地址
  adderss = () => {
    this.props.dispatch(NavigationActions.navigate({routeName: 'Address'}));
  };

  handleWeixinLogin() {
    //微信登录示例
    let scope = 'snsapi_userinfo';
    let state = 'wechat_sdk_demo';
    const that = this;
    //判断微信是否安装
    wechat.isWXAppInstalled().then((isInstalled) => {
      if (isInstalled) {
        //发送授权请求
        wechat
          .sendAuthRequest(scope, state)
          .then((responseCode) => {
            //返回code码，通过code获取access_token
            that.getAccessToken(responseCode.code);
          })
          .catch((err) => {
            Alert.alert('登录授权发生错误：', err.message, [{text: '确定'}]);
          });
      } else {
        Platform.OS == 'ios'
          ? Alert.alert('没有安装微信', '是否安装微信？', [
              {text: '取消'},
              {text: '确定', onPress: () => this.installWechat()},
            ])
          : Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
              {text: '确定'},
            ]);
      }
    });
  }

  // 绑定微信
  getAccessToken(code) {
    // this.props.dispatch({type: 'app/wxLogin', payload: {code, num: 4}});
    this.props.dispatch({
      type: `app/bindWeixin`,
      payload: {
        code: code,
        num: 4,
      },
      callback: (res) => {
        if (res.error == 0) {
          this.props.dispatch({
            type: 'app/updateState',
            payload: {
              user: res.data.user,
            },
          });
          Storage.set('user_info', userInfo);
        }
      },
    });
  }
  installWechat() {
    return;
  }
  // 退出
  logout = () => {
    this.props.dispatch(createAction('app/logout')());
  };

  render() {
    const {
      app: {user},
    } = this.props;
    const {modalVisible, value} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.top}>
            {user.head_img != null ? (
              <Image style={styles.portrait} source={{uri: user.head_img}} />
            ) : (
              <Image
                style={styles.portrait}
                source={require('../images/default_avatar.jpg')}
              />
            )}
            <Text style={styles.change} onPress={this.handleButtonPress}>
              更换
            </Text>
          </View>
          <View style={styles.main}>
            <View style={styles.mainlist}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => {
                  this.setModalVisible(false);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>修改昵称</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => this.onChangeText(text)}
                      value={value}
                    />
                    <View style={styles.footBut}>
                      <View style={styles.button}>
                        <Text style={styles.cancel} onPress={this.cancel}>
                          <Text>取消</Text>
                        </Text>
                        <Text style={styles.determine} onPress={this.determine}>
                          <Text style={styles.destyle}>确定</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              <Text style={styles.name}>昵称</Text>
              <Touchable
                style={styles.mainame}
                onPress={() => {
                  this.setModalVisible(true);
                }}>
                <Text style={styles.mainames}>{user.name}</Text>
              </Touchable>
            </View>
            <View style={styles.mainlist}>
              <Text style={styles.name}>绑定手机号</Text>
              <Text style={styles.mainame} onPress={() => this.ModifyPhone()}>
                {user.phone}
              </Text>
            </View>
            <View style={styles.mainlist}>
              <Text style={styles.name}>绑定微信</Text>
              {/* <Text style={styles.mainame} onPress={()=>this.ModifyPhone()}>
                {user.phone}
              </Text> */}
              <View style={styles.weixin}>
                {user?.bind_app_weixin == 0 ? (
                  <Text
                    style={styles.weixin_text}
                    onPress={this.handleWeixinLogin.bind(this)}>
                    去绑定微信
                  </Text>
                ) : (
                  <Text style={styles.weixin_texts}>已绑定微信</Text>
                )}
              </View>
            </View>
          </View>
          <Touchable onPress={this.adderss}>
            <View style={styles.footer}>
              <Text style={styles.name} onPress={this.adderss}>
                收货地址
              </Text>
              {/* <Text onPress={this.adderss} style={styles.icons}> */}
              <Image
                source={require('../images/next.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              {/* </Text> */}
            </View>
          </Touchable>
          <Touchable onPress={this.logout}>
            <View style={styles.footers}>
              <Text style={styles.name} onPress={this.logout}>
                退出当前账户
              </Text>
              {/* <Text onPress={this.adderss} style={styles.icons}> */}
              {/* <Image source={require('../images/next.png')} style={styles.icon}  resizeMode="contain"/> */}
              {/* </Text> */}
            </View>
          </Touchable>
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
  top: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  portrait: {
    width: pxToDp(120),
    height: pxToDp(120),
    marginRight: pxToDp(30),
    borderRadius: pxToDp(60),
    marginTop: pxToDp(40),
    marginBottom: pxToDp(30),
  },
  change: {
    color: theme.baseColor,
    marginBottom: pxToDp(30),
    fontSize: pxToDp(24),
  },
  main: {
    marginBottom: pxToDp(10),
    marginTop: pxToDp(10),
    backgroundColor: '#fff',
    paddingBottom: pxToDp(30),
    paddingTop: pxToDp(30),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  mainlist: {
    paddingBottom: pxToDp(30),
    paddingTop: pxToDp(30),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weixin: {
    flex: 8,
    height: pxToDp(80),
    lineHeight: pxToDp(80),
  },
  weixin_text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 4,
    color: '#fff',
    width: pxToDp(180),
    height: pxToDp(80),
    lineHeight: pxToDp(80),
    backgroundColor: theme.baseColor,
  },
  weixin_texts: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    color: theme.baseColor,
    width: pxToDp(180),
    height: pxToDp(80),
    lineHeight: pxToDp(80),
    // backgroundColor: theme.baseColor,
  },
  mainame: {
    flex: 8,
    backgroundColor: '#f8f8f8',
    height: pxToDp(80),
    lineHeight: pxToDp(80),
    paddingRight: pxToDp(30),
    paddingLeft: pxToDp(30),
    fontSize: pxToDp(30),
  },
  mainames: {
    height: pxToDp(80),
    lineHeight: pxToDp(80),
    fontSize: pxToDp(30),
  },
  name: {
    flex: 4,
    lineHeight: pxToDp(80),
    fontSize: pxToDp(30),
  },
  icon: {
    width: pxToDp(20),
    height: pxToDp(35),
    // lineHeight: pxToDp(35),
  },
  icons: {
    // height: pxToDp(35),
    // lineHeight: pxToDp(35),
    // width: pxToDp(30),
    // height: pxToDp(50),
    // lineHeight: pxToDp(35),
  },
  footer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pxToDp(120),
    alignItems: 'center',
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  footers: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pxToDp(120),
    alignItems: 'center',
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
    marginTop: pxToDp(10),
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: pxToDp(70),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  mask: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#222',
    opacity: 0.6,
    position: 'absolute',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: pxToDp(30),
    marginRight: pxToDp(30),
    marginBottom: pxToDp(30),
    borderRadius: pxToDp(10),
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderTopColor: '#f2f2f2',
    borderWidth: pxToDp(4),
    borderBottomColor: '#fff',
    borderRightColor: '#fff',
    borderLeftColor: '#fff',
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    // borderRadius: 2,
    height: pxToDp(93),
  },
  footBut: {
    // position:'absolute',
    // bottom:0,
  },
  cancel: {
    width: '50%',
    fontSize: pxToDp(30),
    color: '#2d2d2d',
    borderRightColor: '#f2f2f2',
    borderRightWidth: pxToDp(4),
    textAlign: 'center',
    lineHeight: pxToDp(93),
  },
  determine: {
    width: '50%',
    textAlign: 'center',
    lineHeight: pxToDp(93),
  },
  destyle: {
    color: theme.baseColor,
    fontSize: pxToDp(30),
  },
});

export default connect(({app: {...app}}) => ({app}))(EditMine);
