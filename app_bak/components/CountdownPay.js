import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
moment().locale('zh-cn');

import { pxToDp, theme } from "../utils";

const format = "YYYY-MM-DD HH:mm:ss";

export const CountdownPay = ({ end, onFinish, style, textTimeStyle, ...rest }) => {
    const [time, setTime] = useState('00:00:00');
    const interval = useRef(null);

    useEffect(() => {
        start();
    }, []);

    /**
     * 倒计时开始
     */
    const start = () => {
        interval.current = setInterval(function () {
            setTime(getTime(end--));
        }, 1000);
    };

    /**
     * 倒计时结束，清除定时器
     */
    const stop = () => {
        clearInterval(interval.current);
    };

    /**
     * 获取倒计时时间
     */
    const getTime = (currentTime) => {
        const durationS = moment.duration(currentTime, 's'); // 两个时间相差毫秒数
        const h = durationS.get('h'); // 小时
        const m = durationS.get('m'); // 分钟
        const s = durationS.get('s'); // 秒
        if (h <= 0 && m <= 0 && s <= 0) {
            onFinish('finish'); // 回调父级函数
            stop();
            return '';
        };
        return prefixInteger(h) + ':' + prefixInteger(m) + ':' + prefixInteger(s);
    };

    /**
     * 添加前缀
     * @param {*} num 数字
     * @param {*} n 个数
     */
    const prefixInteger = (num, n = 2) => {
        return (Array(n).join('0') + num).slice(-n);
    };

    return (
        <View style={[styles.countdown, style]} {...rest}>
            <Text style={[styles.countdownTime, textTimeStyle]}>{time}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    countdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    countdownTime: {
        fontSize: pxToDp(24),
        fontWeight: '500',
        color: '#EB5959',
    }
})

export default CountdownPay;
