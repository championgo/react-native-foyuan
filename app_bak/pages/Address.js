import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  Modal,
  TextInput,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
// import {ReactNavComponent, Widget} from 'rn-yunxi';
// import AddressSelect from '../components/AddressSelect';
import AddressSelect from '../pca-code.json';

import {Input, Item} from 'native-base';

// import { Button } from '../components';
import {Touchable} from '../components';
import Picker from 'react-native-picker';

import {pxToDp, theme, NavigationActions} from '../utils';
// import { color } from 'react-native-reanimated';

class Address extends Component {
  static navigationOptions = {
    title: '收货地址',
  };
  constructor(props) {
    super(props);
    this.state = {
      mineDate: [],
      modalVisible: false,
      confirm: false,
      region1: '',
      isPickerVisible: false,
      region2: '',
      value: '',
      phone: '',
      name: '',
      defaulte: false,
      city: false,
      citys: '请选择，请选择，请选择',
      province_id: '',
      city_id: '',
      district_id: '',
      phone_status: false,
      id: '',
      edit: 0,
      isclick: true,
      Picker: true,
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    /**
     * type = 1 表从订单结算也天转过来选择地址
     */
    this.props.dispatch({
      type: `app/address`,
      payload: {},
      callback: (res) => {
        // console.error(res);
        if (res.error == 0) {
          this.setState({
            mineDate: res.data,
          });
        }
      },
    });

    // this.listener = DeviceEventEmitter.addListener('ba', (message) => {
    //   //收到监听后想做的事情
    //   console.log(message);  //监听

    //   // this.setState({
    //   //   Picker :false
    //   // })
    //   // thsi.city()
    //   Picker.hide();
    // })
  }
  componentDidCatch() {}
  //   弹窗(地址填写)
  setModalVisible = (a) => {
    this.setState({
      modalVisible: a,
      value: '',
      phone: '',
      name: '',
      defaulte: false,
      city: false,
      citys: '请选择，请选择，请选择',
      province_id: '',
      city_id: '',
      district_id: '',
      phone_status: false,
      edit: 0,
    });
    // this.props.dispatch(
    //   NavigationActions.navigate({routeName: 'AddressFrom'}),
    // );
  };

  modals = () => {
    this.setModalVisible(false);
    Picker.hide();
  };

  //

  //构造数据
  _createDateData = () => {
    let dataArray = [];
    // dataArray =dataArray.push(AddressSelect);\
    // console.error(AddressSelect.length)
    let a = [];
    for (let i in AddressSelect) {
      // console.error(AddressSelect[i])
      a.push(AddressSelect[i]);
      //arr.push(obj[i]); //值
    }
    for (let i = 0; i < a.length; i++) {
      let secondArray = [];
      for (let j = 0; j < a[i].children.length; j++) {
        let threeArray = [];
        for (let k = 0; k < a[i].children[j].children.length; k++) {
          threeArray.push(a[i].children[j].children[k].name);
        }
        let three = {};
        three[a[i].children[j].name] = threeArray;
        secondArray.push(three);
      }
      let second = {};
      second[a[i].name] = secondArray;

      dataArray.push(second);
    }

    return dataArray;
  };

  city = (a) => {
    Keyboard.dismiss();
    if (this.state.isclick == true) {
      this.setState({
        isclick: false,
      });

      Picker.init({
        pickerData: this._createDateData(),
        pickerCancelBtnText: '取消',
        pickerConfirmBtnText: '确定',
        pickerFontColor: [102, 191, 177, 1],
        pickerTitleText: '',
        selectedValue: [900],
        pickerToolBarBg: [255, 255, 255, 1],
        pickerBg: [255, 255, 255, 1],
        pickerConfirmBtnColor: [102, 191, 177, 1],
        pickerCancelBtnColor: [102, 191, 177, 1],
        onPickerConfirm: (pickedValue, pickedIndex) => {
          // console.log('date', pickedValue, pickedIndex);
          this.setState({
            citys: pickedValue.toString(),
          });
          //this.props.dispatch(createAction('teamStatisticModle/updateState')({ startPickedValue: pickedValue }))
          let a = [];
          for (let i in AddressSelect) {
            // console.error(AddressSelect[i])
            a.push(AddressSelect[i]);
            //arr.push(obj[i]); //值
          }
          for (let i = 0; i < a.length; i++) {
            if (pickedValue[0] == a[i].name) {
              this.setState({
                province_id: a[i].code,
              });
              for (let j = 0; j < a[i].children.length; j++) {
                if (pickedValue[1] == a[i].children[j].name) {
                  this.setState({
                    city_id: a[i].children[j].code,
                  });
                  for (let k = 0; k < a[i].children[j].children.length; k++) {
                    if (pickedValue[2] == a[i].children[j].children[k].name) {
                      this.setState({
                        district_id: a[i].children[j].children[k].code,
                      });
                    }
                  }
                }
              }
            }
          }
        },

        onPickerCancel: (pickedValue, pickedIndex) => {
          // console.log('dates', pickedValue, pickedIndex);
        },
        onPickerSelect: (pickedValue, pickedIndex) => {
          // console.log('dated', pickedValue, pickedIndex);
        },
      });
      Picker.show();
      setTimeout(() => {
        this.setState({isclick: true});
      }, 2000);
    }
  };
  // 保存
  confirm = () => {
    this.setState({
      modalVisible: false,
    });
    let h_def = 0;
    if (this.state.defaulte == true) {
      h_def = 1;
    } else {
      h_def = 0;
    }
    if (this.state.edit == 0) {
      this.props.dispatch({
        type: `app/address_store`,
        payload: {
          address: this.state.value,
          cityName: this.state.citys,
          city_id: this.state.city_id,
          district_id: this.state.district_id,
          id: '',
          is_default: h_def,
          name: this.state.name,
          phone: this.state.phone,
          postcode: '',
          province_id: this.state.province_id,
        },
        callback: (res) => {
          if (res.error == 0) {
            this.props.dispatch({
              type: `app/address_index`,
              payload: {},
              callback: (res) => {
                if (res.error == 0) {
                  this.setState({
                    value: '',
                    phone: '',
                    name: '',
                    defaulte: false,
                    city: false,
                    citys: '请选择，请选择，请选择',
                    province_id: '',
                    city_id: '',
                    district_id: '',
                    phone_status: false,
                    mineDate: res.data,
                  });
                }
              },
            });
          }
        },
      });
    } else {
      this.props.dispatch({
        type: `app/address_update`,
        payload: {
          address: this.state.value,
          cityName: this.state.citys,
          city_id: this.state.city_id,
          district_id: this.state.district_id,
          id: this.state.id,
          is_default: h_def,
          name: this.state.name,
          phone: this.state.phone,
          postcode: '',
          province_id: this.state.province_id,
        },
        callback: (res) => {
          if (res.error == 0) {
            this.props.dispatch({
              type: `app/address_index`,
              payload: {},
              callback: (res) => {
                if (res.error == 0) {
                  this.setState({
                    value: '',
                    phone: '',
                    name: '',
                    defaulte: false,
                    city: false,
                    citys: '请选择，请选择，请选择',
                    province_id: '',
                    city_id: '',
                    district_id: '',
                    phone_status: false,
                    mineDate: res.data,
                  });
                }
              },
            });
          }
        },
      });
    }
  };
  // 默认
  default_false = () => {
    this.setState({
      defaulte: true,
    });
    this.refs.textInput1.blur();
    this.refs.textInput2.blur();
    this.refs.textInput3.blur();
  };
  default_true = () => {
    this.setState({
      defaulte: false,
    });
    this.refs.textInput1.blur();
    this.refs.textInput2.blur();
    this.refs.textInput3.blur();
  };
  // name
  name = (a) => {
    this.setState(
      {
        name: a,
      },
      () => {
        if (
          this.state.citys != '请选择，请选择，请选择' &&
          this.state.name != '' &&
          this.state.value != '' &&
          this.state.phone_status == true
        ) {
          this.setState({
            confirm: true,
          });
        } else {
          this.setState({
            confirm: false,
          });
        }
      },
    );
  };
  // phone
  phone = (a) => {
    if (a.length <= 11) {
      this.setState(
        {
          phone: a,
        },
        () => {
          let c = this.state.phone;
          let Reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if (!Reg.test(c)) {
            this.setState({
              confirm: false,
              phone_status: false,
            });
          } else {
            this.setState({
              phone_status: true,
            });
            // console.error(this.state.citys,this.state.name,this.state.phone,this.state.value)
            if (
              this.state.citys != '请选择，请选择，请选择' &&
              this.state.name != '' &&
              this.state.value != ''
            ) {
              this.setState({
                confirm: true,
              });
            } else {
              this.setState({
                confirm: false,
              });
            }
          }
        },
      );
    }
  };

  // address
  address = (a) => {
    this.setState(
      {
        value: a,
      },
      () => {
        if (
          this.state.citys != '请选择，请选择，请选择' &&
          this.state.name != '' &&
          this.state.value != '' &&
          this.state.phone_status == true
        ) {
          this.setState({
            confirm: true,
          });
        } else {
          this.setState({
            confirm: false,
          });
        }
      },
    );
  };
  // 编辑
  show = (item) => {
    if (item.is_default == 0) {
      this.setState({defaulte: false});
    } else {
      this.setState({defaulte: true});
    }
    this.setState(
      {
        modalVisible: true,
        value: item.address,
        phone: item.phone,
        name: item.name,
        citys:
          item.province?.area_name +
          ',' +
          item.city?.area_name +
          ',' +
          item.district?.area_name,
        phone_status: false,
        id: item.id,
        edit: 1,
        confirm: true,
        phone_status: true,
        city_id: item.city?.code,
        district_id: item.district?.code,
        province_id: item.province?.code,
      },
      () => {},
    );
  };
  // 删除地址
  address_delete = () => {
    this.props.dispatch({
      type: `app/address_delete`,
      payload: {
        id: this.state.id,
      },
      callback: (res) => {
        if (res.error == 0) {
          this.props.dispatch({
            type: `app/address_index`,
            payload: {},
            callback: (res) => {
              if (res.error == 0) {
                this.setState({
                  mineDate: res.data,
                  modalVisible: false,
                });
              }
            },
          });
        }
      },
    });
  };

  /**
   * 选择地址后返回
   * @param {*} item 选择项地址
   */
  chooseAddress = (item) => {
    const {
      navigation: {
        goBack,
        state: {params},
      },
    } = this.props;
    if (params && params.type == 1) {
      goBack();
      params.callback(item);
    }
  };

  // input获取焦点
  onFocus = () => {
    // Keyboard.dismiss()
    console.log('8888');

    Picker.hide();
  };

  onBlur = () => {
    // Keyboard.dismiss()
    console.log('88882');
  };
  _onPress = () => {
    this.refs.textInput1.blur();
    this.refs.textInput2.blur();
    this.refs.textInput3.blur();
  };

  render() {
    const {
      mineDate,
      modalVisible,
      confirm,
      value,
      phone,
      name,
      defaulte,
      city,
      citys,
      edit,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {mineDate.map((item) => (
            <Touchable
              style={styles.address}
              onPress={() => this.chooseAddress(item)}
              key={'address' + item.id}>
              <View style={styles.address_top}>
                <View>
                  <Text
                    style={styles.address_text}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  {item.is_default == 1 ? (
                    <Text style={styles.defau}>默认</Text>
                  ) : (
                    <Text style={styles.none}></Text>
                  )}
                </View>
                <View></View>
              </View>
              <View style={styles.address_main}>
                <View style={styles.add_center}>
                  <Text style={styles.phone}>
                    {item.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </Text>
                  <Text
                    style={styles.area_name}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.province.area_name},{item.city.area_name},
                    {item.district.area_name}
                  </Text>
                  <Text
                    style={styles.addre}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.address}
                  </Text>
                </View>
                <View>
                  <Text onPress={() => this.show(item)} style={styles.edit}>
                    编辑
                  </Text>
                </View>
              </View>
            </Touchable>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Text style={styles.button}>新建收货地址</Text>
          </TouchableHighlight>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => {
            this.modals();
          }}>
          <SafeAreaView>
            <View style={styles.centeredView}>
              <Touchable
                activeOpacity={1}
                style={styles.openButton}
                onPress={() => {
                  this._onPress();
                }}>
                <View style={styles.modalView}>
                  <View style={styles.moder_top}>
                    <View style={styles.Popups}>
                      {edit == 1 ? (
                        <Text style={styles.Popups_text}>编辑收货地址</Text>
                      ) : (
                        <Text style={styles.Popups_text}>添加收货地址</Text>
                      )}
                    </View>
                    <View style={styles.Popups_back}></View>
                    <View style={styles.Popup}>
                      <Touchable
                        style={styles.openButton}
                        onPress={() => {
                          this.city(true);
                        }}>
                        <Text style={styles.citys}>{citys}</Text>
                      </Touchable>
                    </View>
                    <View style={styles.Popup}>
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.address(text)}
                        value={value}
                        onFocus={this.onFocus}
                        ref="textInput1"
                        onBlur={this.onBlur}
                        placeholder="详细地址，如街道，楼牌号"
                      />
                    </View>
                    <View style={styles.Popup}>
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.name(text)}
                        value={name}
                        onFocus={this.onFocus}
                        onEndEditing={this.onBlur}
                        ref="textInput2"
                        placeholder="收件人姓名"
                      />
                    </View>
                    <View style={[styles.Popup, styles.margin]}>
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.phone(text)}
                        value={phone}
                        onFocus={this.onFocus}
                        ref="textInput3"
                        onBlur={this.onBlur}
                        placeholder="收件人电话"
                      />
                    </View>
                  </View>

                  <View style={styles.moder_main}>
                    <View style={styles.default}>
                      <Text style={styles.default_text}>设为默认</Text>
                    </View>
                    {defaulte == false ? (
                      <Touchable onPress={this.default_false}>
                        <View style={styles.div}></View>
                      </Touchable>
                    ) : (
                      <Touchable onPress={this.default_true}>
                        <View>
                          <Image
                            source={require('../images/default.png')}
                            style={styles.default_img}></Image>
                        </View>
                      </Touchable>
                    )}
                  </View>
                  {edit == 1 ? (
                    <View style={styles.moder_main}>
                      <Text style={styles.delete} onPress={this.address_delete}>
                        删除地址
                      </Text>
                    </View>
                  ) : (
                    <View></View>
                  )}

                  <View style={styles.foot_button}>
                    <Text
                      style={styles.cancel}
                      onPress={() => {
                        this.setModalVisible(false);
                      }}>
                      取消
                    </Text>
                    {confirm == true ? (
                      <Text style={styles.confirm} onPress={this.confirm}>
                        保存
                      </Text>
                    ) : (
                      <Text style={styles.confirm_op}>保存</Text>
                    )}
                  </View>
                </View>
              </Touchable>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
    backgroundColor: theme.baseBackgroundColor,
  },
  address: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
    backgroundColor: '#fff',
    marginBottom: pxToDp(10),
    height: pxToDp(196),
    lineHeight: pxToDp(196),
  },
  address_top: {
    width: pxToDp(90),
    height: pxToDp(120),
    marginRight: pxToDp(30),
    lineHeight: pxToDp(120),
    marginTop: pxToDp(22),
    overflow: 'hidden',
    margin: 'auto',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  address_main: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 6,
    // marginLeft: pxToDp(60),
    borderLeftColor: '#eceff3',
    borderWidth: pxToDp(3),
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    paddingLeft: pxToDp(60),
    height: pxToDp(130),
    marginTop: pxToDp(22),
  },
  address_text: {
    width: pxToDp(90),
    overflow: 'hidden',
    textAlign: 'center',
  },
  add_center: {
    flex: 1,
  },
  button: {
    height: pxToDp(120),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.baseColor,
    color: '#fff',
    textAlign: 'center',
    lineHeight: pxToDp(120),
  },
  footer: {
    // position: 'absolute',
    width: '100%',
    // bottom: 0,
  },
  main: {
    position: 'relative',
  },
  phone: {
    fontSize: pxToDp(30),
    color: '#A3A8B0',
    marginBottom: pxToDp(15),
  },
  area_name: {
    color: '#A3A8B0',
    fontSize: pxToDp(30),
    marginBottom: pxToDp(10),
  },
  addre: {
    fontSize: pxToDp(30),
    marginBottom: pxToDp(10),
    color: '#A3A8B0',
  },
  defau: {
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    height: pxToDp(40),
    color: '#a3a8b0',
    textAlign: 'center',
    margin: 'auto',
    backgroundColor: '#f8f8f8',
    fontSize: pxToDp(18),
    lineHeight: pxToDp(40),
  },
  none: {
    height: 0,
  },
  modalView: {
    // margin: 20,
    backgroundColor: theme.baseBackgroundColor,
    // borderRadius: 20,
    // padding: 35,
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
    height: '100%',
    // position: 'relative',
  },
  modalViews: {
    // margin: 20,
    backgroundColor: theme.baseBackgroundColor,
    // borderRadius: 20,
    // padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: '30%',
    // position: 'relative',
  },
  centeredView: {
    width: '100%',
    height: '100%',
    borderColor: '#fff',
    // border:"none"
  },
  centeredViews: {
    width: '100%',
    height: '40%',
  },
  foot_button: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pxToDp(98),
    lineHeight: pxToDp(98),
  },
  cancel: {
    width: '50%',
    textAlign: 'center',
    height: pxToDp(98),
    lineHeight: pxToDp(98),
    fontSize: pxToDp(30),
    backgroundColor: '#fff',
  },
  confirm: {
    width: '50%',
    textAlign: 'center',
    backgroundColor: '#66bfb8',
    color: '#fff',
    height: pxToDp(98),
    lineHeight: pxToDp(98),
    fontSize: pxToDp(30),
  },
  confirm_op: {
    width: '50%',
    textAlign: 'center',
    backgroundColor: '#66bfb8',
    color: '#fff',
    height: pxToDp(98),
    lineHeight: pxToDp(98),
    fontSize: pxToDp(30),
    opacity: 0.6,
  },
  Popup: {
    height: pxToDp(80),
    marginTop: pxToDp(30),
    backgroundColor: theme.baseBackgroundColor,
    width: '100%',
    marginLeft: pxToDp(40),
    marginRight: pxToDp(40),
    // paddingLeft: pxToDp(40),
    // paddingRight: pxToDp(40),
  },
  moder_top: {
    backgroundColor: '#fff',
    width: '100%',
  },
  Popups: {
    marginTop: pxToDp(30),
    // marginBottom: pxToDp(10),
    paddingBottom:pxToDp(10),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
    // borderBottomWidth:pxToDp(3),

    // borderBottomColor:theme.baseBackgroundColor,
    
  },
  Popups_back:{
    backgroundColor:theme.baseBackgroundColor,
    height:pxToDp(5),
    // shadowColor:theme.baseBackgroundColor,
  },
  Popups_text:{
    fontSize: pxToDp(36),
  },
  margin: {
    marginBottom: pxToDp(30),
  },
  input: {
    padding: pxToDp(26),
    fontSize: pxToDp(24),
  },
  moder_main: {
    backgroundColor: '#fff',
    width: '100%',
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
    height: pxToDp(94),
    marginTop: pxToDp(10),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  default: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  div: {
    width: pxToDp(42),
    height: pxToDp(42),
    borderColor: '#a3a8b0',
    borderWidth: 2,
    borderRadius: 3,
  },
  default_text: {
    fontSize: pxToDp(30),
    color: '#000',
  },
  default_img: {
    width: pxToDp(42),
    height: pxToDp(42),
  },
  delete: {
    color: theme.baseColor,
    fontSize: pxToDp(30),
  },
  edit: {
    color: theme.baseColor,
    fontSize: pxToDp(24),
  },
  citys: {
    padding: pxToDp(26),
    fontSize: pxToDp(24),
  },
});

export default connect(({app: {...app}}) => ({app}))(Address);
