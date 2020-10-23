/**
 * @author zhousx
 *
 * description:可滑动的动态 tabView
 */

import React, { Component } from 'react';
import {
    AppRegistry, Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PropTypes from 'prop-types'
let { width, height } = Dimensions.get('window');

export default class ClassificationTabBar extends Component {
    static propTypes = {

        activeTab: PropTypes.number, // 当前被选中的tab下标
        tabs: PropTypes.array, // 所有tabs集合

        tabNames: PropTypes.array, // 保存Tab名称
    };  // 注意这里有分号


    render() {
        return (
            <View style={styles.parent}>
                <View style={styles.tabs}>
                    {/*遍历。系统会提供一个tab和下标 调用一个自定义的方法*/}
                    {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                </View>
                <View style={{ backgroundColor: '#fafafa', width: width, height: 1 }} />
            </View>
        );
    }


    ///  处理tabbar的颜色和字体及图标
    renderTabOption(tab, i) {
        let color = this.props.activeTab === i ? "#cba000" : "#aaaaaa"; // 判断i是否是当前选中的tab，设置不同的颜色
        let color2 = this.props.activeTab === i ? "#cba000" : "#fff"; // 判断i是否是当前选中的tab，设置不同的颜色
        return (
            //因为要有点击效果 所以要引入可触摸组件
            <TouchableOpacity onPress={() => this.props.goToPage(i)} style={styles.tab} key={tab}>
                <View style={styles.tabItem}>
                    <Text style={{ color: color, marginTop: 15 }}>
                        {this.props.tabNames[i]}
                    </Text>
                    <Text
                        style={{ backgroundColor: color2, width: 40, height: 2, marginTop: 10 }} />
                </View>
            </TouchableOpacity>
        );
    }


}

const styles = StyleSheet.create({
    parent: {
        elevation: 2,
        shadowOffset: {
            width: 1, height: 2
        },
    },
    tabs: {
        flexDirection: 'row',
        height: 45,
    },

    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 100
    },

});