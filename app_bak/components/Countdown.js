import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
moment().locale('zh-cn');

import { pxToDp, theme } from "../utils";

const format = "YYYY-MM-DD HH:mm:ss";

export const Countdown = ({ end, tip = '剩余时间', onFinish, style, textTipStyle, textTimeStyle, ...rest }) => {
    const [time, setTime] = useState('00天\xa000:00:00');
    const interval = useRef(null);

    useEffect(() => {
        start();
    }, []);

    /**
     * 倒计时开始
     */
    const start = () => {
        interval.current = setInterval(function () {
            const currentTime = moment().format(format); // 当前时间
            setTime(getTime(currentTime));
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
        end = moment(end).format(format); // 结束时间
        const durationMs = moment.duration(moment(end).diff(moment(currentTime)), 'ms'); // 两个时间相差毫秒数
        const d = durationMs.get('d'); // 天
        const h = durationMs.get('h'); // 小时
        const m = durationMs.get('m'); // 分钟
        const s = durationMs.get('s'); // 秒
        if (h <= 0 && m <= 0 && s <= 0) {
            onFinish('finish'); // 回调父级函数
            stop();
            return '';
        };

        return prefixInteger(d) + '天\xa0' + prefixInteger(h) + ':' + prefixInteger(m) + ':' + prefixInteger(s);
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
            <Text style={[styles.countdownTip, tip === '活动已结束' ? { color: theme.color333 } : '', textTipStyle]}>{tip}</Text>
            <Text style={[styles.countdownTime, textTimeStyle]}>{time}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    countdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    countdownTip: {
        fontSize: pxToDp(24),
        fontWeight: '500',
        color: '#EB5959',
        marginRight: pxToDp(16)
    },
    countdownTime: {
        fontSize: pxToDp(24),
        fontWeight: '500',
        color: '#EB5959',
    }
})

export default Countdown;
