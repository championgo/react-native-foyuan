import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ImageBackground,
} from 'react-native';
import Config from '../config/index';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-tiny-toast';

import {Touchable} from '../components';

import {NavigationActions, pxToDp, theme} from '../utils';

class Feedback extends Component {
  static navigationOptions = {
    title: '我的反馈',
  };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      num: 0,
      img: [],
      feedback: '',
    };
  }
  onChangeText = (value) => {
    this.setState({
      value: value,
    });
  };
  upimg = () => {
    console.log('000');
    ImagePicker.openPicker({
      // width: 120,
      // height: 120,
      // cropping: true,
      // compressImageQuality:0.6,
      mediaType:'photo',
      includeBase64: true,
    }).then((image) => {
      console.error('999');
      Toast.show('上传图片中', {
        position: 0,
        duration: 1000,
      });
      let image_h = 'data:image/png;base64,' + image.data;

      this.props.dispatch({
        type: `app/changeimg`,
        payload: {
          image: image_h,
        },
        callback: (res) => {
          // console.error(image);
          // console.error("xxxxxxxxxxxxxxxxxxx:" + 'http://wwyx.oss-cn-shanghai.aliyuncs.com/' + res.data);
          if (res.error == 0) {
            let arr = this.state.img;
            arr.push(Config.apicommodity + res.data);
            this.setState({
              img: arr,
            });
          }
        },
      });
    });
  };
  //   删除图片
  delete = (item) => {
    console.log(item);
    let arr = this.state.img;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == item) {
        arr.splice(i, 1);
      }
      this.setState({
        img: arr,
      });
    }
  };
  // 提交
  buttons = () => {
    Toast.show('反馈中', {
      position: 0,
      duration: 1000,
    });
    this.props.dispatch({
      type: `app/feedback`,
      payload: {
        contents: this.state.value,
        img: this.state.img,
      },
      callback: (res) => {
        console.log(res);

        if (res.error == 0) {
          this.setState({
            feedback: res.data,
          });
        }
      },
    });
  };
  //   返回个人中心
  mine = () => {
    this.props.dispatch(NavigationActions.navigate({routeName: 'Mine'}));
  };

  render() {
    const {value, num, img, feedback} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {feedback == '' ? (
            <View style={styles.feedback_body}>
              <TextInput
                style={{height: 100, textAlignVertical: 'top'}}
                onChangeText={(text) => this.onChangeText(text)}
                value={value}
                multiline={true}
                placeholder="留下您的意见，让我们变得更好。"
              />

              <View style={styles.main}>
                {img.length > 0 ? (
                  <View
                    style={[
                      img.length == 1
                        ? styles.img_le
                        : img.length == 2
                        ? styles.img_le2
                        : img.length == 3
                        ? styles.img_le3
                        : null,
                    ]}>
                    {img.map((item, index) => (
                      <View style={styles.img_m} key={'img' + index}>
                        {/* <Image
                          style={[styles.portrait]}
                          source={{uri: item}}
                          resizeMode="contain"
                        /> */}
                        <ImageBackground
                          source={{uri: item}}
                          style={styles.portrait}>
                          <Text
                            style={styles.delete}
                            onPress={() => this.delete(item)}>
                            X
                          </Text>
                        </ImageBackground>
                        {/* <Text style={styles.delete}>X</Text> */}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View></View>
                )}

                {img.length < 3 ? (
                  <Touchable
                    onPress={() => this.upimg()}
                    style={styles.img_main}>
                    <View style={styles.img_mains}>
                      <Text style={styles.img_text}>+</Text>
                      <Text style={styles.img}>上传照片</Text>
                    </View>
                  </Touchable>
                ) : (
                  <Text></Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.feedbackSuccess}>
              <Text style={styles.feedback_success_p1}>感谢您的反馈！</Text>
              <Text style={styles.feedback_success_p2}>
                {/* 功德值 +{feedback.num} */}
              </Text>
              <Touchable onPress={() => this.mine()}>
                <View style={styles.feedback_success_button}>
                  <Text style={styles.feedback_success_buttons}>
                    返回个人中心
                  </Text>
                </View>
              </Touchable>
            </View>
          )}
        </ScrollView>

        <View>
          {feedback == '' ? (
            <View>
              {value != '' || img.length > 0 ? (
                <Touchable onPress={() => this.buttons()} style={styles.foot}>
                  <Text style={styles.button} onPress={() => this.buttons()}>
                    提交
                  </Text>
                </Touchable>
              ) : (
                <Text style={styles.buttons}>提交</Text>
              )}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
    backgroundColor: '#fff',
  },
  feedback_body: {
    backgroundColor: theme.baseBackgroundColor,
    marginTop: pxToDp(10),
    marginLeft: pxToDp(40),
    marginBottom: 0,
    marginRight: pxToDp(40),
    padding: pxToDp(30),
  },
  img_main: {
    width: pxToDp(190),
    height: pxToDp(190),
    borderColor: '#a3a8b0',
    borderWidth: 1,
    marginTop: pxToDp(30),
  },
  img_mains: {
    width: '100%',
  },
  portrait: {
    width: pxToDp(190),
    // borderColor: '#a3a8b0',
    // borderWidth: 1,
    marginTop: pxToDp(30),
    height: pxToDp(190),
  },
  img_text: {
    width: '100%',
    fontSize: pxToDp(48),
    textAlign: 'center',
    marginTop: '30%',
    color: '#a3a8b0',
  },
  img: {
    fontSize: pxToDp(24),
    marginTop: '7.6%',
    textAlign: 'center',
    marginBottom: '7.6%',
    color: '#a3a8b0',
  },
  img_le: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '34%',
  },
  img_le2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '68%',
  },
  img_le3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },

  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  margin: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  img_m: {
    position: 'relative',
  },
  delete: {
    position: 'absolute',
    top: pxToDp(0),
    color: '#fff',
    backgroundColor: '#000000',
    opacity: 0.5,
    right: 0,
    width: pxToDp(50),
    height: pxToDp(50),
    textAlign: 'center',
    lineHeight: pxToDp(50),
  },
  foot: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    height: pxToDp(100),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.baseColor,
    color: '#fff',
    textAlign: 'center',
    lineHeight: pxToDp(100),
    fontSize: pxToDp(30),
    zIndex: 9999,
  },
  buttons: {
    height: pxToDp(100),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.baseColor,
    color: '#fff',
    textAlign: 'center',
    lineHeight: pxToDp(100),
    fontSize: pxToDp(30),
    zIndex: 9999,
    opacity: 0.6,
  },
  feedbackSuccess: {
    marginTop: pxToDp(70),
  },
  feedback_success_p1: {
    fontSize: pxToDp(48),
    textAlign: 'center',
    marginBottom: pxToDp(40),
    color: '#2d2d2d',
  },
  feedback_success_p2: {
    fontSize: pxToDp(36),
    textAlign: 'center',
    marginBottom: pxToDp(95),
    color: '#de6449',
  },
  feedback_success_buttons: {
    height: pxToDp(100),
    width: pxToDp(300),
    backgroundColor: theme.baseColor,
    color: '#fff',
    textAlign: 'center',
    lineHeight: pxToDp(100),
    fontSize: pxToDp(30),
  },
  feedback_success_button: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    textAlign: 'center',
  },
});

export default connect(({app: {...app}}) => ({app}))(Feedback);
