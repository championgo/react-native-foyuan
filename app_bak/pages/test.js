import * as React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import {
    TabView,
    TabBar,
    SceneMap,
    NavigationState,
    SceneRendererProps,
} from 'react-native-tab-view';
import { Loading } from '../components';
import PageOne from './HomeSec/PageOne'
import PageTwo from './HomeSec/PageTwo'
import { theme, pxToDp } from '../utils';

const homeMeau = [
    { name: '首页', id: 1 },
];

class ScrollableTabBarExample extends React.Component {
    // eslint-disable-next-line react/sort-comp
    static title = 'Scrollable tab bar';
    static backgroundColor = '#3f51b5';
    static appbarElevation = 0;

    state = {
        index: 0,
        routes: [
            // { key: 'article', title: 'Article' },
            // { key: 'contacts', title: 'Contacts' },
            // { key: 'albums', title: 'Albums' },
            // { key: 'chat', title: 'Chat' },
        ],
        datas: [],
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: "HomeModel/getHomeMeauList",
            payload: {},
            callback: res => {
                const meunList = res;
                const newDataArray = [...meunList];
                const newRoutes = newDataArray.map(item => {
                    return {
                        key: item.id,
                        title: item.name
                    };
                });

                this.setState({
                    routes: newRoutes,
                }, () => {
                    this.getHomeListPlateService();
                });
            }
        });
    }

    /**
     * 首页导航列表详情
     */
    getHomeListPlateService = () => {
        const { dispatch } = this.props;
        const { index, datas, routes } = this.state;
        const id = routes[index].key;

        /**
         * 有数据就不请求了
         */
        if (!!datas[index]) {
            return;
        }

        dispatch({
            type: "HomeModel/getHomeListPlate",
            payload: {
                id
            },
            callback: res => {
                console.log('请求：', res);
                datas.push(res);
                this.setState({
                    datas
                });
            }
        });
    }

    /**
     * 切换导航
     * @param {*} index 导航索引
     */
    handleIndexChange = (index) => {
        this.setState({
            index,
        }, () => {
            this.getHomeListPlateService();
        });
    }

    renderTabBar = (
        props
    ) => (
            <TabBar
                {...props}
                scrollEnabled
                indicatorStyle={styles.indicator}
                style={styles.tabbar}
                tabStyle={styles.tab}
                labelStyle={styles.label}
            />
        );

    renderScene = ({ route }) => {
        const { index, datas } = this.state;
        return <PageTwo key={route.key} data={datas[index]} index={index} />;
    };

    render() {
        const { HomeModel: { meauListLoading } } = this.props;

        if (meauListLoading) {
            return <Loading />
        }

        return (
            <TabView
                swipeEnabled={false}
                navigationState={this.state}
                renderScene={this.renderScene}
                renderTabBar={this.renderTabBar}
                onIndexChange={this.handleIndexChange}
            />
        );
    }
}

const styles = StyleSheet.create({
    tabbar: {
        backgroundColor: theme.colorWhite,
    },
    tab: {
        width: 120,
    },
    indicator: {
        backgroundColor: theme.baseColor,
    },
    label: {
        color: '#333',
        fontSize: pxToDp(32)
    },
});

export default connect(
    ({
        HomeModel: { ...HomeModel }
    }) => ({
        HomeModel
    })
)(ScrollableTabBarExample);