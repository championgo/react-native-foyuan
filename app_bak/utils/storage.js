import { AsyncStorage } from 'react-native'
import React from 'react';
import { Dimensions, PixelRatio } from 'react-native';

var adaptionParams = {
    uiWidth: 375,//这里的值，是设计稿中的宽度，你们根据自己的设计稿改动，本人拿到的设计稿是iphone6的
    uiHeight: 667,//这里的值，是设计稿中的高度，你们根据自己的设计稿改动，本人拿到的设计稿是iphone6的
    pixel: 1 / PixelRatio.get(),
    screenWidth: Dimensions.get('window').width,
    screenHeith: Dimensions.get('window').height,
    pixelRatio: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
    scale: Math.min(Dimensions.get('window').height / 667, Dimensions.get('window').width / 375),
}

/*宽度适配，例如我的设计稿某个样式宽度是50pt，那么使用就是：utils.autoWidth(50)*/
function autoWidth(value) {
  return Dimensions.get('window').width * value / adaptionParams.uiWidth;
}
/*高度适配，例如我的设计稿某个样式高度是50pt，那么使用就是：utils.autoheight(50)*/
function autoheight(value) {
    return Dimensions.get('window').height * value / adaptionParams.uiHeight;
}
/*字体大小适配，例如我的设计稿字体大小是17pt，那么使用就是：utils.setSpText(17)*/
function setSpText(number) {
    number = Math.round((number * adaptionParams.scale + 0.5) * adaptionParams.pixelRatio / adaptionParams.fontScale);
    return number / PixelRatio.get();
}

function clear() {
  return AsyncStorage.clear()
}

function get(key, defaultValue = null) {
  return AsyncStorage.getItem(key).then(
    value => (value !== null ? JSON.parse(value) : defaultValue)
  )
}

function set(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value))
}

function remove(key) {
  return AsyncStorage.removeItem(key)
}

function multiGet(...keys) {
  return AsyncStorage.multiGet([...keys]).then(stores => {
    const data = {}
    stores.forEach((result, i, store) => {
      data[store[i][0]] = JSON.parse(store[i][1])
    })
    return data
  })
}

function multiRemove(...keys) {
  return AsyncStorage.multiRemove([...keys])
}

function changeTwoDecimal_f(x) {
  try {
      let f_x1 = parseFloat(x);
      if (isNaN(f_x1)) {
          return x;
      }
      let f_x = Math.round(x * 100) / 100;
      let s_x = f_x.toString();
      let pos_decimal = s_x.indexOf('.');
      if (pos_decimal < 0) {
          pos_decimal = s_x.length;
          s_x += '.';
      }
      while (s_x.length <= pos_decimal + 2) {
          s_x += '0';
      }
      return s_x;
  } catch (e) {
      return '0.00';
  }
}

export default {
  clear,
  get,
  set,
  remove,
  multiGet,
  multiRemove,
  changeTwoDecimal_f,
  autoWidth,
  autoheight,
  setSpText
}
