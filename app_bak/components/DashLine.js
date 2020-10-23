import React from 'react';
import { View } from 'react-native';

/**
 * 虚线组件
 * @param {String} color 线条颜色
 * @param {String} backgroundColor 背景颜色
 * @param {Number} lineWidth 线条粗细
 * @param {Object} style 组件样式
 * @returns {Component}
 */
export const DashLine = ({ color = 'black', backgroundColor = 'white', borderStyle = "dashed", lineWidth, style = {} }) => {
    const wrapperStyle = {
        height: lineWidth,
        overflow: 'hidden'
    };
    const lineStyle = {
        height: 0,
        borderColor: color,
        borderWidth: lineWidth,
        borderStyle,
        borderRadius: 0.1,
    };
    const lineMask = {
        marginTop: -lineWidth,
        height: lineWidth,
        backgroundColor: backgroundColor
    };

    return (
        <View style={[wrapperStyle, style]}>
            <View style={lineStyle} />
            <View style={lineMask} />
        </View>
    );
};

export default DashLine;
