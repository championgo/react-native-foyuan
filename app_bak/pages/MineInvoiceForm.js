import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Modal,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import AddressSelect from '../pca-code.json';

import {Touchable} from '../components';
import Toast from 'react-native-tiny-toast';
import Picker from 'react-native-picker';

import {NavigationActions, pxToDp, theme, Storage} from '../utils';

class MineInvoiceForm extends Component {
  static navigationOptions = {
    title: '发票填写',
  };
  constructor(props) {
    super(props);
    this.state = {
      invoice_type: 0, //0电子1纸质
      defaulte1: true,
      defaulte2: false, //默认个人
      phone: '', //收货人手机号
      value: '',
      email: '', //邮箱
      number: '', //纳税人识别号
      postcode: '', //收货人地址邮编
      address1: '请选择，请选择，请选择', //收货人地址（可选）
      address2: '', //收货人地址（填写）
      content: '明细', //发票内容
      invoiceMoney: '',
      invoiceData: [], //页面填写的信息
      modalVisible: false,
      isclick: true,
      pageSize: 10,
    };
  }
  //获取个人数据
  componentDidMount = async () => {
    console.log('666');
    this.setState({
      invoiceParam: await Storage.get('params'),
    });
    // console.log(await Storage.get('params'));
    console.log(this.state.invoiceParam);
  };

  //   发票抬头
  default_false1 = () => {
    if (this.state.defaulte2) {
      this.setState({
        defaulte2: false,
      });
    }
    this.setState({
      defaulte1: true,
    });
  };
  default_true1 = () => {
    this.setState({
      defaulte1: false,
    });
  };
  default_false = () => {
    console.log(this.state.invoiceParam.invoiceMoney);
    // if (this.state.invoiceParam.invoiceMoney < 200) {
    //   Toast.show('票据金额不足200元，不支持邮寄纸质发票哦', {
    //     position: 0,
    //     duration: 2000,
    //   });
    // } else {
    if (this.state.defaulte1) {
      this.setState({
        defaulte1: false,
      });
    }
    this.setState({
      defaulte2: true,
    });
    // }
  };
  default_true = () => {
    this.setState({
      defaulte2: false,
    });
  };

  //构造数据
  _createDateData = () => {
    let dataArray = [];
    let a = [];
    for (let i in AddressSelect) {
      a.push(AddressSelect[i]);
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
        pickerToolBarBg: [0, 0, 0, 0],
        pickerBg: [0, 0, 0, 0],
        pickerConfirmBtnColor: [102, 191, 177, 1],
        pickerCancelBtnColor: [102, 191, 177, 1],
        onPickerConfirm: (pickedValue, pickedIndex) => {
          this.setState({
            address1: pickedValue.toString(),
          });
          let a = [];
          for (let i in AddressSelect) {
            a.push(AddressSelect[i]);
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

        onPickerCancel: (pickedValue, pickedIndex) => {},
        onPickerSelect: (pickedValue, pickedIndex) => {},
      });
      Picker.show();
      setTimeout(() => {
        this.setState({isclick: true});
      }, 2000);
    }
  };

  //   个人姓名/单位名称
  onChangeText = (value) => {
    this.setState({
      value: value,
    });
  };

  //   纳税人识别号或统一社会信用代码
  onChangenumber = (number) => {
    this.setState({
      number: number,
    });
  };

  //   手机号
  onChangephone = (phone) => {
    this.setState({
      phone: phone,
    });
  };
  // 邮箱
  onChangeemail = (email) => {
    this.setState({
      email: email,
    });
  };
  // 收件地址
  //   onChangeaddress1 = (address1) => {
  //     this.setState({
  //       address1: address1,
  //     });
  //   };
  // 详细地址
  onChangeaddress2 = (address2) => {
    this.setState({
      address2: address2,
    });
  };
  // 邮编
  onChangepostcode = (postcode) => {
    this.setState({
      postcode: postcode,
    });
  };
  //   明细
  detailed = () => {
    Toast.show(
      '依照国税局开票法规，优选订单开具纸质发票、电子发票，开票内容为明细',
      {
        position: 0,
        duration: 2000,
      },
    );
  };

  //   弹窗
  setModalVisible = (a) => {
    this.setState({
      modalVisible: a,
    });
  };
  //   电子发票
  invoice = () => {
    this.setState({
      invoice_type: 0,
      modalVisible: false,
    });
  };
  // 纸质发票
  invoiceType = () => {
    if (this.state.invoiceParam.invoiceMoney < 200) {
      Toast.show('票据金额不足200元，不支持邮寄纸质发票哦', {
        position: 0,
        duration: 2000,
      });
      this.setState({
        modalVisible: false,
      });
    } else {
      this.setState({
        invoice_type: 1,
        modalVisible: false,
      });
    }
  };

  //   确定
  openNext = () => {
    if (!this.state.value) {
      Toast.show('请将票据信息补充完整', {
        position: 0,
        duration: 2000,
      });
      return;
    }
    let phone = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!this.state.phone || !this.state.phone.match(phone)) {
      Toast.show('请填写正确格式的手机号', {
        position: 0,
        duration: 2000,
      });
      return;
    }
    if (this.state.defaulte2) {
      //单位
      let number = /[0-9A-Z]{18}/;
      if (!this.state.number || !this.state.number.match(number)) {
        Toast.show('请填写正确格式的纳税人识别号或统一社会信用代码', {
          position: 0,
          duration: 2000,
        });
        return;
      }
    }
    if (this.state.invoice_type == 0) {
      //电子
      let email = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!this.state.email || !this.state.email.match(email)) {
        Toast.show('请填写正确格式的邮箱', {
          position: 0,
          duration: 2000,
        });
        return;
      }
    } else {
      //纸质
      if (!this.state.address1 || !this.state.address2) {
        Toast.show('请将地址信息填写完整', {
          position: 0,
          duration: 2000,
        });
        return;
      }
      let postcode = /^[0-9]{6}$/;
      if (!this.state.postcode || !this.state.match(postcode)) {
        Toast.show('请填写正确格式的邮编', {
          position: 0,
          duration: 2000,
        });
        return;
      }
    }
    let arr = [];
    for (let i in this.state.invoiceParam.invoiceList) {
      arr.push(this.state.invoiceParam.invoiceList[i].id);
    }
    console.log(arr);
    let invoice_body = '';
    if (this.state.defaulte1) {
      invoice_body = 0;
    }
    if (this.state.defaulte2) {
      invoice_body = 1;
    }
    console.log(this.state.invoiceParam.invoiceShop);
    this.props.dispatch({
      type: `Mine/addInvoiceList`,
      payload: {
        shop_id: this.state.invoiceParam.invoiceShop,
        invoice_body: invoice_body,
        invoice_type: this.state.invoice_type,
        invoice_client: this.state.value,
        content: this.state.content,
        phone: this.state.phone,
        email: this.state.email,
        number: this.state.number,
        postcode: this.state.postcode,
        address: this.state.address1 + this.state.address2,
        arr: arr,
      },
      callback: (res) => {
        console.log(res);
        if (res.error == 0) {
          Toast.show('开票成功', {
            position: 0,
            duration: 2000,
          });
          const {dispatch} = this.props;

          dispatch({
            type: `Mine/invoice`,
            payload: {
              page: 1,
              pageSize: this.state.pageSize,
            },
            callback: (res) => {
              console.log(res, 'res');
              if (res.error == 0) {
                this.setState({
                  list: res.data,
                });
                dispatch({
                  type: `Mine/updateState`,
                  payload: {
                    lists: res.data,
                  },
                });
                // console.log("99999999999999999")
                // console.log(res.data,"lists")
              }
            },
          });
          dispatch({
            type: `Mine/getProjectOrder`,
            payload: {},
            callback: (res) => {
              console.log(res);
              console.log(1111);
              if (res.error == 0) {
                for (let i in res.data) {
                  res.data[i].select = false;
                  res.data[i].product_status = false;
                }
                this.setState({
                  orderList: res.data,
                });
                dispatch({
                  type: `Mine/updateState`,
                  payload: {
                    orderLists: res.data,
                  },
                });
                console.log(this.state.orderList);
              }
            },
          });
          dispatch(NavigationActions.navigate({routeName: 'MyInvoice'}));
        }
      },
    });
  };

  // input获取焦点
  onFocus = () => {
    // Keyboard.dismiss()
    Picker.hide();
  };
  render() {
    const {
      defaulte1,
      defaulte2,
      value,
      phone,
      email,
      address1,
      address2,
      number,
      postcode,
      invoiceParam,
      modalVisible,
      invoice_type,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.top}>
              基于人工、邮寄成本等因素考虑，我们为开票200以上、有发票需求的用户开具并邮寄纸质发票（200元以下的，如果需要，可开具电子发票，发到邮箱）
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.list_left}>发票类型</Text>
            <Touchable
              onPress={() => {
                this.setModalVisible(true);
              }}
              style={styles.list_right}>
              <View style={styles.list_rights}>
                {invoice_type == 0 ? (
                  <Text style={styles.list_left}>电子发票</Text>
                ) : (
                  <Text style={styles.list_left}>纸质发票</Text>
                )}
                <Image
                  source={require('../images/down.png')}
                  style={styles.down}></Image>
              </View>
            </Touchable>
          </View>
          <View style={styles.list}>
            <Text style={styles.list_left}>发票抬头</Text>
            <View style={styles.list_right}>
              <View style={styles.flex}>
                {defaulte1 == false ? (
                  <Touchable onPress={() => this.default_false1()}>
                    <View style={styles.div}></View>
                  </Touchable>
                ) : (
                  <Touchable onPress={() => this.default_true1()}>
                    <View>
                      <Image
                        source={require('../images/default.png')}
                        style={styles.default_img}></Image>
                    </View>
                  </Touchable>
                )}
                <Text>个人</Text>
              </View>
              <View style={styles.flex}>
                {defaulte2 == false ? (
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
                <Text>企业</Text>
              </View>
            </View>
          </View>
          <View style={styles.list}>
            {defaulte1 ? <Text style={styles.list_left}>个人姓名</Text> : null}
            {defaulte2 ? <Text style={styles.list_left}>单位名称</Text> : null}
            <View style={styles.list_right}>
              {defaulte1 ? (
                <TextInput
                  style={styles.TextInput}
                  onChangeText={(text) => this.onChangeText(text)}
                  value={value}
                  onFocus={this.onFocus}
                  placeholder="请输入个人姓名"
                />
              ) : null}
              {defaulte2 ? (
                <TextInput
                  style={styles.TextInput}
                  onChangeText={(text) => this.onChangeText(text)}
                  value={value}
                  onFocus={this.onFocus}
                  placeholder="请输入单位名称"
                />
              ) : null}
            </View>
          </View>
          {defaulte2 ? (
            <View style={styles.list}>
              <Text style={styles.list_left}></Text>
              <View style={styles.list_right}>
                <TextInput
                  style={styles.TextInput}
                  onChangeText={(text) => this.onChangenumber(text)}
                  value={number}
                  onFocus={this.onFocus}
                  placeholder="纳税人识别号或统一社会信用代码"
                />
              </View>
            </View>
          ) : null}
          <View style={styles.list}>
            <Text style={styles.list_left}>手机号</Text>
            <View style={styles.list_right}>
              <TextInput
                style={styles.TextInput}
                onChangeText={(text) => this.onChangephone(text)}
                value={phone}
                onFocus={this.onFocus}
                placeholder="请输入收件人手机号"
              />
            </View>
          </View>
          {invoice_type == 0 ? (
            <View style={styles.list}>
              <Text style={styles.list_left}>邮箱</Text>
              <View style={styles.list_right}>
                <TextInput
                  style={styles.TextInput}
                  onChangeText={(text) => this.onChangeemail(text)}
                  value={email}
                  onFocus={this.onFocus}
                  placeholder="请输入收件人邮箱"
                />
              </View>
            </View>
          ) : null}
          {invoice_type == 1 ? (
            <View style={styles.list}>
              <Text style={styles.list_left}>地址</Text>
              <Touchable
                style={styles.list_right}
                onPress={() => {
                  this.city(true);
                }}>
                <View>
                  {/* <TextInput
                  style={styles.TextInput}
                  onChangeText={(text) => this.onChangeaddress1(text)}
                  value={address1}
                  placeholder="请输入收件地址"
                /> */}
                  <Text style={styles.invoiceMoney}>{address1}</Text>
                </View>
              </Touchable>
            </View>
          ) : null}
          {invoice_type == 1 ? (
            <View style={styles.list}>
              <Text style={styles.list_left}></Text>
              <View style={styles.list_right}>
                <TextInput
                  style={styles.TextInput}
                  onChangeText={(text) => this.onChangeaddress2(text)}
                  value={address2}
                  onFocus={this.onFocus}
                  placeholder="详细地址，如街道，楼牌号"
                />
              </View>
            </View>
          ) : null}
          {invoice_type == 1 ? (
            <View style={styles.list}>
              <Text style={styles.list_left}>邮编</Text>
              <View style={styles.list_right}>
                <TextInput
                  style={styles.TextInput}
                  onChangeText={(text) => this.onChangepostcode(text)}
                  value={postcode}
                  onFocus={this.onFocus}
                  placeholder="请输入收件地邮编"
                />
              </View>
            </View>
          ) : null}
          <View style={styles.list}>
            <Text style={styles.list_left}>发票内容</Text>
            <Touchable
              onPress={() => this.detailed()}
              style={styles.list_right}>
              <View style={styles.list_rights}>
                <Text style={styles.list_left}>明细</Text>

                <Image
                  source={require('../images/detailed.png')}
                  style={styles.down}></Image>
              </View>
            </Touchable>
          </View>
          <View style={styles.list}>
            <Text style={styles.list_left}>发票金额</Text>
            <View style={styles.list_right}>
              <Text style={styles.invoiceMoney}>
                {invoiceParam?.invoiceMoney}元
              </Text>
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(false);
            }}>
            <SafeAreaView>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.modal}>
                    <Touchable
                      onPress={() => {
                        this.invoice();
                      }}
                      style={styles.mode1}>
                      <View>
                        <Text style={styles.madal_text}>电子发票</Text>
                      </View>
                    </Touchable>
                    <Touchable
                      onPress={() => {
                        this.invoiceType();
                      }}
                      style={styles.mode2}>
                      <View>
                        <Text style={styles.madal_text}>纸质发票</Text>
                      </View>
                    </Touchable>
                    <View style={styles.baseBackgroundColor}></View>
                    <Touchable
                      onPress={() => {
                        this.setModalVisible(false);
                      }}
                      style={styles.mode}>
                      <View>
                        <Text style={styles.madal_text}>取消</Text>
                      </View>
                    </Touchable>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </ScrollView>
        <View>
          <View style={styles.footers}>
            <Touchable
              style={styles.openButton}
              onPress={() => {
                this.openNext();
              }}>
              <Text style={styles.button}>确定</Text>
            </Touchable>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.baseBackgroundColor,
    // position: 'relative',
  },
  top: {
    color: '#ff826e',
    fontSize: pxToDp(24),
    paddingTop: pxToDp(30),
    paddingBottom: pxToDp(30),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  div: {
    width: pxToDp(42),
    height: pxToDp(42),
    borderColor: '#a3a8b0',
    borderWidth: 2,
    borderRadius: 3,
    marginRight: pxToDp(4),
  },
  default_img: {
    width: pxToDp(42),
    height: pxToDp(42),
    marginRight: pxToDp(4),
  },
  list: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: pxToDp(30),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  list_left: {
    flex: 3,
  },
  down: {
    width: pxToDp(30),
    height: pxToDp(30),
  },
  list_rights: {
    flex: 9,
    backgroundColor: '#f2f2f2',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: pxToDp(42),
    // paddingTop: pxToDp(20),
    // paddingBottom: pxToDp(20),
  },
  list_right: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 9,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20),
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
  },
  invoiceMoney: {
    height: pxToDp(42),
  },
  flex: {
    flex: 6,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextInput: {
    // height: pxToDp(42),
    width: '100%',
    color: '#000',
    paddingBottom: pxToDp(0),
    paddingTop: pxToDp(0),
  },
  footers: {
    // position: 'absolute',
    width: '100%',
    // bottom: 0,
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
  },
  centeredView: {
    // flex: 1,
    // marginTop: '90%',
    height: '100%',
    // height: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    height: '30%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  mode: {
    height: '34%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red'
  },
  baseBackgroundColor: {
    backgroundColor: theme.baseBackgroundColor,
    height: pxToDp(10),
  },
  modal: {
    width: '100%',
    height: '100%',
  },
  mode1: {
    width: '100%',
    height: '33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: theme.baseBackgroundColor,
    borderBottomWidth: pxToDp(3),
  },
  mode2: {
    width: '100%',
    height: '33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  madal_text: {
    fontSize: pxToDp(30),
  },
});

export default connect(({Mine: {...Mine}}) => ({Mine}))(MineInvoiceForm);
