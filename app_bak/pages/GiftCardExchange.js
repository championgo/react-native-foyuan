import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';

import {Touchable} from '../components';
import Toast from 'react-native-tiny-toast';

import {NavigationActions, pxToDp, theme} from '../utils';

class GiftCardExchange extends Component {
  static navigationOptions = {
    title: '礼品卡的兑换',
  };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      modalVisible: false,
    };
  }
  onChangeText = (value) => {
    this.setState({
      value: value,
    });
  };
  //   弹窗
  setModalVisible = (a) => {
    this.setState({
      modalVisible: a,
    });
  };
  cancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
  determine = () => {
    console.log(this.state.value)
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        const {dispatch} = this.props;
        dispatch({
          type: `Mine/getGiftCard`,
          payload: {
            cardnumber: this.state.value,
          },
          callback: (res) => {
            console.log(res);
            console.log(11111);
            if (res.error != 0) {
              Toast.show(res.errmsg, {
                position: 0,
                duration: 2000,
              });
            }
            if (res.error == 0) {
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
                        prices: res.data,
                      },
                    });
                  }
                },
              });
              dispatch({
                type: `Mine/getExchange`,
                payload: {},
                callback: (res) => {
                  console.log(res);
                  console.log(11111);
                  if (res.error == 0) {
                    this.setState({
                      giftList: res.data,
                    });
                    dispatch({
                      type: 'Mine/updateState',
                      payload: {
                        giftLists: res.data,
                      },
                    });
                  }
                },
              });
              dispatch(NavigationActions.navigate({routeName: 'GiftCard'}));
            }
          },
        });
      },
    );
  };

  render() {
    const {value, modalVisible} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.gift_card}>
            <View style={styles.gift_card_exchange}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.onChangeText(text)}
                value={value}
                placeholder="请输入卡号"
              />
            </View>

            <View style={styles.footer}>
              {value == '' ? (
                <View style={styles.exchange_but}>
                  <Text style={styles.text}>兑换</Text>
                </View>
              ) : (
                <Touchable
                  style={styles.openButton}
                  onPress={() => {
                    this.setModalVisible(true);
                  }}>
                  <View style={styles.exchange_buts}>
                    <Text style={styles.text}>兑换</Text>
                  </View>
                </Touchable>
              )}
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    您确定要激活该张礼品卡吗?
                  </Text>
                  <View style={styles.footBut}>
                    <View style={styles.button}>
                      <Text style={styles.cancel} onPress={this.cancel}>
                        <Text>否</Text>
                      </Text>
                      <Text style={styles.determine} onPress={this.determine}>
                        <Text style={styles.destyle}>是</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
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
  gift_card: {
    paddingTop: pxToDp(40),
    paddingRight: pxToDp(40),
    paddingLeft: pxToDp(40),
  },
  gift_card_exchange: {
    backgroundColor: theme.baseBackgroundColor,
    paddingLeft: pxToDp(35),
    paddingRight: pxToDp(35),
    fontSize: pxToDp(30),
  },
  input:{
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20),
  },
  exchange_but: {
    backgroundColor: theme.baseColor,
    width: pxToDp(440),
    height: pxToDp(100),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
  },
  exchange_buts: {
    backgroundColor: theme.baseColor,
    width: pxToDp(440),
    height: pxToDp(100),
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: pxToDp(30),
    color: '#fff',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: pxToDp(150),
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
    borderRadius: 6,
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
  },
  openButton: {
    // backgroundColor: "#F194FF",
    // borderRadius: 20,
    // padding: 10,
    // elevation: 2
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: pxToDp(75),
    marginTop: pxToDp(75),
    textAlign: 'center',
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
    // borderRadius: 20,
    height: pxToDp(93),
  },
  cancel: {
    width: '50%',
    fontSize: pxToDp(30),
    color: '#2d2d2d',
    borderRightColor: '#f2f2f2',
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightWidth:pxToDp(4),
    // borderWidth: pxToDp(4),
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

export default connect(({Mine: {...Mine}}) => ({Mine}))(GiftCardExchange);
