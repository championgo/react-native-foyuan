import React from 'react';
import {Dimensions, PixelRatio} from 'react-native';

var adaption = {
    uiWidth: 375,//这里的值，是设计稿中的宽度，你们根据自己的设计稿改动，本人拿到的设计稿是iphone6的
    uiHeight: 667,//这里的值，是设计稿中的高度，你们根据自己的设计稿改动，本人拿到的设计稿是iphone6的
    pixel: 1 / PixelRatio.get(),
    screenWidth: Dimensions.get('window').width,
    screenHeith: Dimensions.get('window').height,
    pixelRatio: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
    scale: Math.min(Dimensions.get('window').height / 667, Dimensions.get('window').width / 375),

    /*宽度适配，例如我的设计稿某个样式宽度是50pt，那么使用就是：adaption.autoWidth(50)*/
    autoWidth: function (value) {
        return Dimensions.get('window').width * value / this.uiWidth;
    },
    /*高度适配，例如我的设计稿某个样式高度是50pt，那么使用就是：adaption.autoheight(50)*/
    autoheight: function (value) {
        return Dimensions.get('window').height * value / this.uiHeight;
    },
    get: function (url, successCallback, failCallback) {
        fetch(url).then((response) => response.text())
            .then((responseText) => {
                successCallback(JSON.parse(responseText));
            }).catch(function (err) {
            failCallback(err);
        });
    },
    /*字体大小适配，例如我的设计稿字体大小是17pt，那么使用就是：adaption.setSpText(17)*/
    setSpText: function (number) {
        number = Math.round((number * this.scale + 0.5) * this.pixelRatio / this.fontScale);
        return number / PixelRatio.get();
    }
};

module.exports = adaption;